-- ==============================================================================
-- eReceipt - National Electronic Tax Register & Fiscal Clearance System
-- PostgreSQL Seed Data Script
-- ==============================================================================

-- 1. Insert Registered Taxpayer Master Records (Ministry of Revenue Registry)
INSERT INTO registered_taxpayers (tin, trade_name, vat_number, registration_status, designated_withholding_agent, tax_center, verified_at)
VALUES
    ('0012345678', 'Hana Trading PLC', 'VAT-ET-0012345678', 'ACTIVE', TRUE, 'Large Taxpayers Office (LTO), Addis Ababa', CURRENT_TIMESTAMP),
    ('0098765432', 'Abyssinia General Merchandise Share Co.', 'VAT-ET-0098765432', 'ACTIVE', TRUE, 'Medium Taxpayers Office Bole Branch', CURRENT_TIMESTAMP),
    ('0045678901', 'Selam Tech Solutions Enterprise', 'VAT-ET-0045678901', 'ACTIVE', FALSE, 'Kirkos Sub-City Branch', CURRENT_TIMESTAMP),
    ('0012847391', 'Abeba Market PLC', 'VAT-ET-0012847391', 'ACTIVE', TRUE, 'Large Taxpayers Office (LTO), Addis Ababa', CURRENT_TIMESTAMP),
    ('0017932054', 'Desta Pharmacy', 'VAT-ET-0017932054', 'ACTIVE', FALSE, 'Adama City Tax Center', CURRENT_TIMESTAMP),
    ('0014638290', 'Blue Nile Books & Stationery', 'VAT-ET-0014638290', 'ACTIVE', FALSE, 'Bahir Dar Regional Office', CURRENT_TIMESTAMP),
    ('0019274635', 'Lomi Bakery', 'VAT-ET-0019274635', 'ACTIVE', FALSE, 'Bole Sub-City Branch', CURRENT_TIMESTAMP),
    ('0016528347', 'Walia Spares', 'VAT-ET-0016528347', 'ACTIVE', FALSE, 'Hawassa Regional Office', CURRENT_TIMESTAMP)
ON CONFLICT (tin) DO NOTHING;

-- 2. Insert MoR Revenue Officers & Administrators
-- Note: Passwords stored as Argon2id/bcrypt hashes or demonstration hashes
INSERT INTO officers (id, username, password_hash, name, badge_number, role, email, department, branch, is_active)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'officer.demo', '$argon2id$v=19$m=65536,t=3,p=4$demoHashRevenue123', 'Abebe Bikila', 'RO-101', 'REVENUE_OFFICER', 'officer.demo@mor.gov.et', 'Tax Audit & Enforcement', 'Addis Ababa Large Taxpayers Branch', TRUE),
    ('a0000000-0000-0000-0000-000000000002', 'officer.fani', '$argon2id$v=19$m=65536,t=3,p=4$demoHashPassword123', 'Fanuel Kassahun', 'RO-305', 'REVENUE_OFFICER', 'fanuel.kassahun@mor.gov.et', 'Tax Audit & Enforcement', 'Addis Ababa Large Taxpayers Branch', TRUE),
    ('a0000000-0000-0000-0000-000000000003', 'admin', '$argon2id$v=19$m=65536,t=3,p=4$demoHashAdmin123', 'Revenue System Administrator', 'ADM-001', 'ADMIN', 'admin@mor.gov.et', 'Ministry Information Systems', 'Ministry of Revenues Head Office', TRUE)
ON CONFLICT (username) DO NOTHING;

-- 3. Insert Standard Products Catalog
INSERT INTO products (id, code, name, price, uom, vat_category, excise_rate, supply_type, is_active)
VALUES
    (101, 'GR-104', 'Sidamo Coffee 500g', 680.00, 'PCS', 'Standard VAT (15%)', 10.00, 'Goods', TRUE),
    (102, 'GR-118', 'Teff Flour 5kg', 920.00, 'KG', 'Standard VAT (15%)', 0.00, 'Goods', TRUE),
    (103, 'ST-042', 'Leather Notebook', 450.00, 'PCS', 'Standard VAT (15%)', 0.00, 'Goods', TRUE),
    (104, 'HM-091', 'Desk Lamp', 1250.00, 'PCS', 'Standard VAT (15%)', 20.00, 'Goods', TRUE),
    (105, 'HM-076', 'Coffee Cup Set', 780.00, 'BOX', 'Standard VAT (15%)', 0.00, 'Goods', TRUE),
    (106, 'ST-018', 'Blue Pen Pack (10pcs)', 180.00, 'BOX', 'Standard VAT (15%)', 0.00, 'Goods', TRUE),
    (107, 'SV-001', 'Logistics / Delivery Service', 250.00, 'HRS', 'Standard VAT (15%)', 0.00, 'Services', TRUE),
    (108, 'SV-012', 'Gift Packaging & Handling', 120.00, 'PCS', 'Standard VAT (15%)', 0.00, 'Services', TRUE)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, vat_category = EXCLUDED.vat_category, excise_rate = EXCLUDED.excise_rate;

SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- 4. Insert Initial Fiscal Sequence
INSERT INTO fiscal_sequences (merchant_code, register_code, fiscal_year, current_sequence)
VALUES
    ('ABEB', '01', 2026, 194),
    ('ABEB', 'POS-01', 2026, 194)
ON CONFLICT (merchant_code, register_code, fiscal_year) DO NOTHING;

-- 5. Insert Sample Merchants & Applications
INSERT INTO merchants (
    id, reference_number, merchant_id, status,
    full_name, phone_number, email, email_verified, password_hash,
    seller_legal_name, trade_name, tin, business_license_number, category, classification, vat_registration_number, is_authorized,
    city, sub_city, building_name, floor, gps_location,
    document_path, uploaded_file_name, uploaded_file_size, is_document_ready, certified
) VALUES
    (
        'b0000000-0000-0000-0000-000000000001', 'APP-2026-0148', 'MER-10482', 'Approved',
        'Abeba Market Management', '+251 91 123 4567', 'contact@abebamarket.et', TRUE,
        '$argon2id$v=19$m=65536,t=3,p=4$demoHashPass123',
        'Abeba Market PLC', 'Abeba Market', '0012847391', 'BL-AA-2024-9912', 'Retail', 'VAT', 'VAT-ET-0012847391', TRUE,
        'Addis Ababa', 'Bole Sub-city', 'Sunshine Plaza', 'Ground Floor', '9.0123, 38.7421',
        '/uploads/licenses/trade_license_2026.pdf', 'trade_license_2026.pdf', '2.4 MB', TRUE, TRUE
    ),
    (
        'b0000000-0000-0000-0000-000000000002', 'APP-2026-0147', 'MER-10481', 'Under Review',
        'Desta Haile', '+251 92 345 6789', 'desta.pharmacy@gmail.com', TRUE,
        '$argon2id$v=19$m=65536,t=3,p=4$demoHashPass123',
        'Desta Pharmacy', 'Desta Pharmacy', '0017932054', 'BL-AD-2023-4512', 'Pharmacy', 'VAT', NULL, FALSE,
        'Adama', 'Bole Sub-city', 'Red Cross Bldg', 'Ground Floor', '8.5412, 39.2684',
        '/uploads/licenses/health_bureau_license.pdf', 'health_bureau_license.pdf', '1.8 MB', TRUE, TRUE
    ),
    (
        'b0000000-0000-0000-0000-000000000003', 'APP-2026-0145', 'MER-10479', 'Additional Information Required',
        'Solomon Belay', '+251 91 876 5432', 'solomon.belay@bluenilebooks.et', TRUE,
        '$argon2id$v=19$m=65536,t=3,p=4$demoHashPass123',
        'Blue Nile Stationery', 'Blue Nile Books & Stationery', '0014638290', 'BL-BD-2025-1109', 'Wholesale', 'VAT', NULL, FALSE,
        'Bahir Dar', 'Belay Zeleke Sub-city', 'Tana Commercial', '1st Floor', '11.5934, 37.3908',
        '/uploads/licenses/tin_certificate.pdf', 'tin_certificate.pdf', '1.2 MB', TRUE, TRUE
    ),
    (
        'b0000000-0000-0000-0000-000000000004', 'APP-2026-0142', 'MER-10476', 'Approved',
        'Lomi Abera', '+251 93 456 7890', 'lomi.cafe@ethionet.et', TRUE,
        '$argon2id$v=19$m=65536,t=3,p=4$demoHashPass123',
        'Lomi Café and Bakery', 'Lomi Bakery', '0019274635', 'BL-AA-2024-3312', 'Hospitality', 'VAT', 'VAT-ET-0019274635', TRUE,
        'Addis Ababa', 'Bole Sub-city', 'Medhanialem Mall', 'Ground Floor', '8.9984, 38.7892',
        '/uploads/licenses/trade_license_full.pdf', 'trade_license_full.pdf', '3.1 MB', TRUE, TRUE
    ),
    (
        'b0000000-0000-0000-0000-000000000005', 'APP-2026-0139', 'MER-10473', 'Rejected',
        'Walia Motors PLC', '+251 91 654 3210', 'info@waliamotors.et', TRUE,
        '$argon2id$v=19$m=65536,t=3,p=4$demoHashPass123',
        'Walia Auto Parts', 'Walia Spares', '0016528347', 'BL-HW-2023-7890', 'Automotive', 'VAT', NULL, FALSE,
        'Hawassa', 'Tabor Sub-city', 'Piazza Center', 'Ground Floor', '7.0504, 38.4763',
        '/uploads/licenses/walia_docs.pdf', 'walia_docs.pdf', '1.9 MB', TRUE, TRUE
    )
ON CONFLICT (reference_number) DO NOTHING;

-- 6. Insert Sample Cleared Fiscal Receipts
INSERT INTO receipts (
    id, receipt_number, irn, rrn,
    merchant_id, merchant_tin, merchant_name, merchant_address,
    document_type, transaction_mode,
    customer_name, customer_tin, customer_phone, designated_withholding_agent,
    status, fiscal_year, branch_code, register_code, sequence,
    digital_signature, clearance_timestamp, qr_payload, qr_verification_url,
    subtotal, excise_tax, tax, tax_rate, withholding_tax, total,
    payment_method, payment_reference
) VALUES
    (
        'c0000000-0000-0000-0000-000000000001',
        'RC-2026-0048', 'IRN-ET-2026-829103819', 'RRN-ET-2026-918237461',
        'b0000000-0000-0000-0000-000000000001', '0012847391', 'Abeba Market PLC', 'Bole Sub-city, Addis Ababa',
        'Electronic Tax Invoice (VAT Invoice)', 'B2C / Walk-in Customer',
        'Walk-in Customer', NULL, NULL, FALSE,
        'CLEARED', 2026, 'HQ', 'POS-01', 193,
        'SHA256:7B9A3F1E4C2D8812...EIMS', CURRENT_TIMESTAMP - INTERVAL '3 days',
        'ET-EIMS|RC-2026-0048|IRN-ET-2026-829103819||241.50|SHA256:7B9A3F1E4C2D8812',
        'https://eims.mor.gov.et/verify?irn=IRN-ET-2026-829103819&amt=241.50',
        210.00, 0.00, 31.50, 0.1500, 0.00, 241.50,
        'Telebirr', 'TEL-981273912'
    ),
    (
        'c0000000-0000-0000-0000-000000000002',
        'RC-2026-0049', 'IRN-ET-2026-928172648', 'RRN-ET-2026-827361529',
        'b0000000-0000-0000-0000-000000000001', '0012847391', 'Abeba Market PLC', 'Bole Sub-city, Addis Ababa',
        'Electronic Tax Invoice (VAT Invoice)', 'B2B / Registered Buyer',
        'Ethio Retail & Logistics Enterprise', '0012345678', '+251 91 234 5678', TRUE,
        'CLEARED', 2026, 'HQ', 'POS-01', 194,
        'SHA256:9C3B1A8D7E4F2290...EIMS', CURRENT_TIMESTAMP - INTERVAL '1 day',
        'ET-EIMS|RC-2026-0049|IRN-ET-2026-928172648|0012345678|2323.00|SHA256:9C3B1A8D7E4F2290',
        'https://eims.mor.gov.et/verify?irn=IRN-ET-2026-928172648&tin=0012345678&amt=2323.00',
        2020.00, 0.00, 303.00, 0.1500, 0.00, 2323.00,
        'CBE Birr', 'CBE-481927391'
    )
ON CONFLICT (receipt_number) DO NOTHING;

-- 7. Insert Receipt Line Items
INSERT INTO receipt_items (
    receipt_id, product_id, code, name, quantity, unit_price, uom, discount,
    vat_category, vat_rate, vat_amount, excise_rate, excise_amount, supply_type, line_total
) VALUES
    ('c0000000-0000-0000-0000-000000000001', 101, 'GR-104', 'Sidamo Coffee 500g', 1, 680.00, 'PCS', 0.00, 'Standard VAT (15%)', 0.1500, 102.00, 10.00, 68.00, 'Goods', 850.00),
    ('c0000000-0000-0000-0000-000000000002', 102, 'GR-118', 'Teff Flour 5kg', 2, 920.00, 'KG', 0.00, 'Standard VAT (15%)', 0.1500, 276.00, 0.00, 0.00, 'Goods', 2116.00)
ON CONFLICT DO NOTHING;

-- 8. Insert Tax Reports
INSERT INTO tax_reports (
    reference_number, merchant_id, merchant_tin, merchant_name, tax_period, category,
    gross_sales, tax_collected, tax_paid, status, submission_date, reviewed_by
) VALUES
    ('TR-2026-0918', 'b0000000-0000-0000-0000-000000000001', '0012847391', 'Abeba Market PLC', 'September 2026', 'VAT', 1368400.00, 178487.00, 178487.00, 'Cleared', CURRENT_TIMESTAMP - INTERVAL '15 days', 'Abebe Bikila'),
    ('TR-2026-0914', 'b0000000-0000-0000-0000-000000000004', '0019274635', 'Lomi Bakery', 'September 2026', 'VAT', 412000.00, 53739.00, 0.00, 'Pending Review', CURRENT_TIMESTAMP - INTERVAL '10 days', NULL),
    ('TR-2026-0909', 'b0000000-0000-0000-0000-000000000002', '0017932054', 'Desta Pharmacy', 'August 2026', 'VAT', 689000.00, 89869.00, 0.00, 'Audit Flagged', CURRENT_TIMESTAMP - INTERVAL '30 days', 'Fanuel Kassahun')
ON CONFLICT (reference_number) DO NOTHING;

-- 9. Insert Audit Log Events
INSERT INTO audit_logs (user_identifier, role, action, resource, reference_id, status_transition, ip_address, metadata)
VALUES
    ('officer.demo', 'officer', 'Tax report approved', 'TaxReport', 'TR-2026-0918', 'Pending Review → Approved', '196.188.12.44', '{"officerBadge": "RO-101", "decision": "approve"}'::jsonb),
    ('MER-10482', 'merchant', 'Receipt cleared with MoR EIMS', 'Receipt', 'RC-2026-0049', 'Draft → Cleared', '197.156.78.12', '{"tin": "0012847391", "total": 2323.00}'::jsonb),
    ('system', 'system', 'Fiscal sequence incremented', 'FiscalSequence', 'POS-01', '193 → 194', '127.0.0.1', '{"year": 2026}'::jsonb);
