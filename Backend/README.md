# eReceipt MoR EIMS Fiscal Clearance Backend

The backend engine for **eReceipt**, powering real-time clearance, cryptographic digital signing, tax calculations, buyer TIN verification, and sequential fiscal receipt issuance in compliance with the **Ethiopian Ministry of Revenues (MoR) Electronic Invoice Management System (EIMS)** regulations.

---

## 🏗️ Architecture & Features

- **Sequential Fiscal Numbering**: Thread-safe persistent sequence counter adhering to `[MERCHANT]-[REGISTER]-[YEAR]-[SEQUENCE]` (e.g. `AM2081-REG01-2026-000195`).
- **Cryptographic Digital Signature**: SHA-256 HMAC digital signing simulating hardware/fiscal register signature keys.
- **MoR Taxpayer Registry Validation**: Validation of 10-digit TINs, VAT status, and designated withholding agent authorization.
- **Statutory Ethiopian Tax Engine**:
  - Net Line Amount: $(\text{Unit Price} \times \text{Quantity}) - \text{Discount}$
  - Excise Tax: $\text{Net Amount} \times (\text{Excise Rate} / 100)$
  - Standard VAT (15%): $(\text{Net Amount} + \text{Excise Tax}) \times 0.15$
  - Withholding Tax (2%): Eligible only for B2B transactions where Goods Subtotal > 10,000 ETB or Services Subtotal > 3,000 ETB, and buyer is a designated agent.
  - B2C Identification Rules: Customer TIN and Fayda National ID (FIN) are both optional for B2C walk-in receipts; 10-digit TIN is required for B2B registered business buyers.
  - Credit/Debit Notes: Mandates original cleared IRN and adjustment reason.
- **Persistent Storage**: Automatic JSON database storage in `data/` for zero external database dependencies.

---

## 📡 API Endpoints

### 1. Health & Connection
- **`GET /api/health`**
  Returns server health status, fiscal configuration, and EIMS connectivity mode.

### 2. Receipt Issuance & Clearance
- **`POST /api/receipts/issue`**
  Validates draft receipt according to statutory rules, executes fiscal clearance with MoR EIMS, signs receipt, persists, and returns complete `IssuedReceipt` with HTTP 201.
- **`POST /api/receipts/calculate`**
  Calculates and returns line-by-line item tax breakdowns, subtotals, VAT, excise, withholding eligibility, and grand totals.
- **`GET /api/receipts`**
  Lists issued receipts with optional query filters: `?search=...`, `?documentType=...`, `?limit=...`, `?offset=...`.
- **`GET /api/receipts/:id`**
  Fetches receipt by internal ID, IRN, or receipt number.
- **`GET /api/receipts/verify/:irn`**
  Public verification endpoint matching MoR QR verification scanning.

### 3. Taxpayer TIN Verification
- **`POST /api/tin/verify`** (or `GET /api/tin/:tin`)
  Verifies 10-digit Ethiopian TIN against the MoR registry.

### 4. Products Catalog
- **`GET /api/products`**
  Returns standard products with default pricing, UOM, VAT categories, and excise tax rates.

---

## 🚀 Running the Backend

From the `Backend/` directory:

```powershell
# Development mode with hot-reloading
npm run dev

# Or run directly
npm start
```

Default server URL: **`http://localhost:5000`**
