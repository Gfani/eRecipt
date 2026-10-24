# Backend Feature Documentation: Settings Profile & MoR Clearance Preview

**Author:** Gemechu  
**Branch:** `gemechu-backend`  

---

## Overview
This module implements the backend REST endpoints strictly corresponding to the Settings (Business Profile) management and official Ministry of Revenue (MoR) Clearance / QR verification previews.

* **Base Route:** `/api`
* **Response Wrapper:** Standardized via `src/common/apiResponse.ts` (`sendSuccess`, `sendError`).
* **Type Safety:** Full TypeScript interfaces with zero compile errors (`npm run build`).

---

## Endpoints

### 1. Merchant Profile Management (`/api/settings`)
* **`GET /api/settings/profile`**
  * **Description:** Retrieves the authenticated merchant's accredited profile details.
  * **Response:** Legal name, trade name, verified immutable identifiers (`TIN: 001•••••42`, `Merchant Ref: AM-2081`), contact email, phone number, and physical address.
* **`PATCH /api/settings/profile`**
  * **Description:** Updates business operational contact information (`businessEmail`, `phoneNumber`, `businessAddress`).
  * **Security Enforcement:** Rejects any modification attempt to `tin` or `merchantRef` with a `400 Bad Request` ("TIN and Merchant Reference are verified and immutable").

---

### 2. Tax Invoice MoR Clearance & QR Verification (`/api/invoices`)
* **`GET /api/invoices/:id/clearance-preview`**
  * **Description:** Delivers the official clearance document structure matching Ministry of Revenue (MoR) EIMS requirements.
  * **Payload:** IRN (`ET-EIMS-...`), RRN, dual dates (Gregorian and Ethiopian Calendar `E.C.`), seller/buyer tax data, itemized 15% VAT, total amounts, and amount in words (ETB).
* **`GET /api/invoices/:id/qr-payload`**
  * **Description:** Provides the cryptographic verification payload.
  * **Payload:** Official MoR verification URL (`https://eims.mor.gov.et/verify?irn=...`) and SHA-256 digital signature hash computed across key invoice fields.

---

## Verification & Isolation
* **Build:** Compiles cleanly with `tsc` (`npm run build`) with 0 errors.
* **Isolation:** Zero changes to teammate route modules (`merchants`, `tin`, `receipts`, `admin`, `db.ts`).
