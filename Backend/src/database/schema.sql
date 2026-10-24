-- ==============================================================================
-- eReceipt - National Electronic Tax Register & Fiscal Clearance System
-- PostgreSQL Relational Database Schema
-- Compatible with PostgreSQL 13+
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. Custom Enumeration Types
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE taxpayer_status_enum AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status_enum AS ENUM (
        'Pending',
        'Under Review',
        'Approved',
        'Rejected',
        'Additional Information Required',
        'Suspended'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE merchant_classification_enum AS ENUM ('VAT', 'TOT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE officer_role_enum AS ENUM ('REVENUE_OFFICER', 'SENIOR_AUDITOR', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type_enum AS ENUM (
        'Electronic Tax Invoice (VAT Invoice)',
        'Electronic Cash / Payment Receipt',
        'Credit Note',
        'Debit Note'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_mode_enum AS ENUM (
        'B2B / Registered Buyer',
        'B2C / Walk-in Customer'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE receipt_status_enum AS ENUM ('CLEARED', 'REJECTED', 'CANCELLED', 'VOIDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_enum AS ENUM (
        'Cash',
        'Telebirr',
        'CBE Birr',
        'M-Pesa',
        'Bank Transfer — CBE',
        'Bank Transfer — Awash',
        'Bank Transfer — Abyssinia',
        'Bank Transfer — Dashen',
        'Check',
        'Credit'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vat_category_enum AS ENUM (
        'Standard VAT (15%)',
        'Zero-Rated (0%)',
        'VAT Exempt'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE supply_type_enum AS ENUM ('Goods', 'Services');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE uom_type_enum AS ENUM ('PCS', 'KG', 'LTR', 'HRS', 'BOX');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_role_enum AS ENUM ('merchant', 'officer', 'admin', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. Trigger Function for Automatic Timestamp Updating
-- ==============================================================================

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. Tables Definitions
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 4.1. Registered Taxpayers Authority Table (Ministry of Revenue Master Records)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registered_taxpayers (
    tin VARCHAR(10) PRIMARY KEY,
    trade_name VARCHAR(255) NOT NULL,
    vat_number VARCHAR(50),
    registration_status taxpayer_status_enum NOT NULL DEFAULT 'ACTIVE',
    designated_withholding_agent BOOLEAN NOT NULL DEFAULT FALSE,
    tax_center VARCHAR(255) NOT NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_tin_length CHECK (length(tin) = 10)
);

CREATE INDEX IF NOT EXISTS idx_registered_taxpayers_status ON registered_taxpayers(registration_status);

-- ------------------------------------------------------------------------------
-- 4.2. MoR Revenue Officers & Administrators Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS officers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    badge_number VARCHAR(50) UNIQUE NOT NULL,
    role officer_role_enum NOT NULL DEFAULT 'REVENUE_OFFICER',
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(255) NOT NULL DEFAULT 'Tax Audit & Enforcement',
    branch VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp_officers
BEFORE UPDATE ON officers
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE INDEX IF NOT EXISTS idx_officers_badge ON officers(badge_number);
CREATE INDEX IF NOT EXISTS idx_officers_role ON officers(role);

-- ------------------------------------------------------------------------------
-- 4.3. Officer Active Sessions Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS officer_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    officer_id UUID NOT NULL REFERENCES officers(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_officer_sessions_token ON officer_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_officer_sessions_expires ON officer_sessions(expires_at);

-- ------------------------------------------------------------------------------
-- 4.4. Merchants & Applications Table (Central Merchant Registry)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. APP-2026-0148
    merchant_id VARCHAR(50) UNIQUE,              -- e.g. MER-10482
    status application_status_enum NOT NULL DEFAULT 'Pending',
    submission_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Account credentials & contact
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    password_hash VARCHAR(255) NOT NULL,

    -- Business & Tax identity
    seller_legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255) NOT NULL,
    tin VARCHAR(10) NOT NULL,
    business_license_number VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'General Merchant',
    classification merchant_classification_enum NOT NULL DEFAULT 'VAT',
    vat_registration_number VARCHAR(50),
    is_authorized BOOLEAN NOT NULL DEFAULT FALSE,

    -- Location Details
    city VARCHAR(100) NOT NULL,
    sub_city VARCHAR(100) NOT NULL,
    building_name VARCHAR(255) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    gps_location VARCHAR(100),

    -- Verification Documents
    document_path TEXT,
    uploaded_file_name VARCHAR(255),
    uploaded_file_size VARCHAR(50),
    is_document_ready BOOLEAN NOT NULL DEFAULT FALSE,
    certified BOOLEAN NOT NULL DEFAULT TRUE,

    -- Officer Review & Decision
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    rejection_reason TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_merchant_tin_format CHECK (length(tin) = 10)
);

CREATE TRIGGER set_timestamp_merchants
BEFORE UPDATE ON merchants
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE INDEX IF NOT EXISTS idx_merchants_tin ON merchants(tin);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);
CREATE INDEX IF NOT EXISTS idx_merchants_ref ON merchants(reference_number);
CREATE INDEX IF NOT EXISTS idx_merchants_merchant_id ON merchants(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchants_city_subcity ON merchants(city, sub_city);

-- ------------------------------------------------------------------------------
-- 4.5. Merchant Verification History / Re-verification Log
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS merchant_verification_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    changed_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    document_name VARCHAR(255),
    document_path TEXT,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_merchant_verif_history_merchant ON merchant_verification_history(merchant_id);

-- ------------------------------------------------------------------------------
-- 4.6. Products / Catalog Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE, -- NULL for shared default catalog
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    uom uom_type_enum NOT NULL DEFAULT 'PCS',
    vat_category vat_category_enum NOT NULL DEFAULT 'Standard VAT (15%)',
    excise_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (excise_rate >= 0),
    supply_type supply_type_enum NOT NULL DEFAULT 'Goods',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp_products
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_merchant ON products(merchant_id);

-- ------------------------------------------------------------------------------
-- 4.7. Fiscal Sequences Table (Ensures contiguous fiscal sequences per register)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fiscal_sequences (
    id SERIAL PRIMARY KEY,
    merchant_code VARCHAR(50) NOT NULL,
    register_code VARCHAR(50) NOT NULL,
    fiscal_year INT NOT NULL,
    current_sequence BIGINT NOT NULL DEFAULT 194,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_fiscal_sequence UNIQUE (merchant_code, register_code, fiscal_year)
);

-- ------------------------------------------------------------------------------
-- 4.8. Receipts / Invoices Table (Official Cleared Fiscal Tax Invoices)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number VARCHAR(100) UNIQUE NOT NULL, -- e.g. ABEB-01-2026-000195 or RC-2026-0049
    irn VARCHAR(100) UNIQUE NOT NULL,            -- Invoice Reference Number
    rrn VARCHAR(100),                            -- Receipt Reference Number
    
    -- Merchant relationship & snapshot
    merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
    merchant_tin VARCHAR(10) NOT NULL,
    merchant_name VARCHAR(255) NOT NULL,
    merchant_address TEXT,

    -- Document Classification
    document_type document_type_enum NOT NULL,
    transaction_mode transaction_mode_enum NOT NULL,

    -- Customer & Buyer Details
    customer_name VARCHAR(255) NOT NULL DEFAULT 'Walk-in Customer',
    customer_tin VARCHAR(10),
    customer_vat VARCHAR(50),
    customer_national_id VARCHAR(50), -- Fayda National ID (FIN)
    customer_phone VARCHAR(50),
    designated_withholding_agent BOOLEAN NOT NULL DEFAULT FALSE,
    withholding_reference VARCHAR(100),

    -- Adjustment context (for Credit / Debit Notes)
    original_irn VARCHAR(100),
    adjustment_reason TEXT,

    -- Fiscal Clearance Attributes
    status receipt_status_enum NOT NULL DEFAULT 'CLEARED',
    fiscal_year INT NOT NULL,
    branch_code VARCHAR(50) NOT NULL DEFAULT 'HQ',
    register_code VARCHAR(50) NOT NULL DEFAULT 'POS-01',
    sequence BIGINT NOT NULL,
    digital_signature TEXT NOT NULL,
    clearance_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    qr_payload TEXT,
    qr_verification_url TEXT,

    -- Financial Breakdown (in Ethiopian Birr - ETB)
    subtotal NUMERIC(14, 2) NOT NULL CHECK (subtotal >= 0),
    excise_tax NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (excise_tax >= 0),
    tax NUMERIC(14, 2) NOT NULL CHECK (tax >= 0),
    tax_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.1500,
    withholding_tax NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (withholding_tax >= 0),
    total NUMERIC(14, 2) NOT NULL CHECK (total >= 0),

    -- Payment Details
    payment_method payment_method_enum NOT NULL DEFAULT 'Cash',
    payment_reference VARCHAR(100),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp_receipts
BEFORE UPDATE ON receipts
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE INDEX IF NOT EXISTS idx_receipts_receipt_number ON receipts(receipt_number);
CREATE INDEX IF NOT EXISTS idx_receipts_irn ON receipts(irn);
CREATE INDEX IF NOT EXISTS idx_receipts_merchant_tin ON receipts(merchant_tin);
CREATE INDEX IF NOT EXISTS idx_receipts_customer_tin ON receipts(customer_tin);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON receipts(created_at);
CREATE INDEX IF NOT EXISTS idx_receipts_status ON receipts(status);
CREATE INDEX IF NOT EXISTS idx_receipts_document_type ON receipts(document_type);

-- ------------------------------------------------------------------------------
-- 4.9. Receipt Line Items Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS receipt_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_id UUID NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    code VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    quantity NUMERIC(12, 3) NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    uom uom_type_enum NOT NULL DEFAULT 'PCS',
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    vat_category vat_category_enum NOT NULL DEFAULT 'Standard VAT (15%)',
    vat_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.1500,
    vat_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (vat_amount >= 0),
    excise_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (excise_rate >= 0),
    excise_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (excise_amount >= 0),
    supply_type supply_type_enum NOT NULL DEFAULT 'Goods',
    line_total NUMERIC(14, 2) NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX IF NOT EXISTS idx_receipt_items_receipt_id ON receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_receipt_items_product_id ON receipt_items(product_id);

-- ------------------------------------------------------------------------------
-- 4.10. Monthly Tax Reports / Periodic Filings Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tax_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. TR-2026-0918
    merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
    merchant_tin VARCHAR(10) NOT NULL,
    merchant_name VARCHAR(255) NOT NULL,
    tax_period VARCHAR(50) NOT NULL,              -- e.g. "September 2026"
    category merchant_classification_enum NOT NULL DEFAULT 'VAT',
    gross_sales NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (gross_sales >= 0),
    tax_collected NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (tax_collected >= 0),
    tax_paid NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (tax_paid >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'Pending Review',
    submission_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp_tax_reports
BEFORE UPDATE ON tax_reports
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE INDEX IF NOT EXISTS idx_tax_reports_ref ON tax_reports(reference_number);
CREATE INDEX IF NOT EXISTS idx_tax_reports_tin ON tax_reports(merchant_tin);
CREATE INDEX IF NOT EXISTS idx_tax_reports_period ON tax_reports(tax_period);

-- ------------------------------------------------------------------------------
-- 4.11. OTP Verification Table (for 2FA and Email Verification)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    purpose VARCHAR(50) NOT NULL,                 -- e.g. 'MERCHANT_REGISTRATION', 'OFFICER_2FA'
    recipient_name VARCHAR(255),
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 5,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otp_email_purpose ON otp_verifications(email, purpose);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_verifications(expires_at);

-- ------------------------------------------------------------------------------
-- 4.12. Audit Logs Table (Full Statutory & System Compliance Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_identifier VARCHAR(255) NOT NULL,        -- User ID, username, or TIN
    role audit_role_enum NOT NULL DEFAULT 'system',
    action VARCHAR(255) NOT NULL,                 -- e.g. 'Tax report approved', 'Receipt cleared'
    resource VARCHAR(255) NOT NULL,               -- e.g. 'Receipt', 'TaxReport', 'MerchantApplication'
    reference_id VARCHAR(100),                    -- Associated document reference
    status_transition VARCHAR(100),               -- e.g. 'Pending Review → Approved'
    ip_address VARCHAR(45),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_identifier);
CREATE INDEX IF NOT EXISTS idx_audit_logs_reference ON audit_logs(reference_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_metadata_gin ON audit_logs USING gin (metadata);

-- ==============================================================================
-- 5. Analytical Views for Reporting and Administration
-- ==============================================================================

-- 5.1. Verified Merchant Directory View
CREATE OR REPLACE VIEW v_merchant_directory AS
SELECT
    m.id,
    m.merchant_id,
    m.seller_legal_name AS name,
    m.trade_name,
    m.tin,
    m.category,
    m.classification,
    m.status,
    CASE 
        WHEN m.status = 'Approved' THEN 'Authorized'
        ELSE 'Suspended'
    END AS authorization,
    m.submission_date AS registered_date,
    CONCAT(m.building_name, ', ', m.sub_city, ', ', m.city) AS address,
    m.email AS contact_email,
    m.phone_number AS contact_phone,
    m.vat_registration_number,
    COALESCE(SUM(r.total), 0) AS total_sales_recorded,
    COUNT(r.id) AS total_receipts_issued
FROM merchants m
LEFT JOIN receipts r ON r.merchant_id = m.id AND r.status = 'CLEARED'
GROUP BY m.id;

-- 5.2. Monthly Tax Aggregation View
CREATE OR REPLACE VIEW v_monthly_tax_summary AS
SELECT
    m.id AS merchant_id,
    m.tin AS merchant_tin,
    m.trade_name AS merchant_name,
    TO_CHAR(r.clearance_timestamp, 'YYYY-MM') AS month_key,
    TO_CHAR(r.clearance_timestamp, 'FMMonth YYYY') AS month_name,
    COUNT(r.id) AS receipt_count,
    COALESCE(SUM(r.subtotal), 0) AS total_gross_sales,
    COALESCE(SUM(r.tax), 0) AS total_vat_collected,
    COALESCE(SUM(r.excise_tax), 0) AS total_excise_collected,
    COALESCE(SUM(r.withholding_tax), 0) AS total_withholding_deducted,
    COALESCE(SUM(r.total), 0) AS total_cleared_amount
FROM receipts r
JOIN merchants m ON r.merchant_tin = m.tin
WHERE r.status = 'CLEARED'
GROUP BY m.id, m.tin, m.trade_name, TO_CHAR(r.clearance_timestamp, 'YYYY-MM'), TO_CHAR(r.clearance_timestamp, 'FMMonth YYYY');

-- 5.3. Officer Compliance Overview View
CREATE OR REPLACE VIEW v_compliance_overview AS
SELECT
    (SELECT COUNT(*) FROM merchants WHERE status = 'Approved') AS active_merchants_count,
    (SELECT COUNT(*) FROM merchants WHERE status = 'Pending') AS pending_applications_count,
    (SELECT COUNT(*) FROM receipts WHERE status = 'CLEARED') AS total_cleared_receipts,
    (SELECT COALESCE(SUM(total), 0) FROM receipts WHERE status = 'CLEARED') AS total_revenue_cleared,
    (SELECT COALESCE(SUM(tax), 0) FROM receipts WHERE status = 'CLEARED') AS total_vat_collected;
