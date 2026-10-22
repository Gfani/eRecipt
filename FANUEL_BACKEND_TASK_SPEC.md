# PROMPT SPECIFICATION FOR AI AGENT: Merchant Registration, Officer Auth & Merchant Management Backend

> **INSTRUCTIONS FOR THE AGENT:**  
> You are working on the **eReceipt** Digital Receipt & Tax Administration System backend.  
> Read this document carefully and execute the task autonomously. Do NOT modify any existing files outside your assigned module.

---

## 1. Project Context & Division of Work
The backend is built with **Node.js, Express, and TypeScript (ESM / NodeNext)** in `Backend/`.
The project is divided between two backend developers:

- **Developer 1 (Fanuel - YOU)**: **Merchant Registration, Officer Authentication, and Merchant Approvals & Taxpayer Directory**.
- **Developer 2 (Teammate)**: Fiscal Oversight, Tax Reports, Sales Records & Audit Trail (under `Backend/src/features/admin/fiscal-oversight/`).

### Strict Collaboration Rule:
- ⛔ **DO NOT** edit, overwrite, or delete any files inside `Backend/src/features/admin/fiscal-oversight/` (Teammate's domain).
- 📁 **YOUR WORK** is contained strictly inside:
  1. `Backend/src/features/merchant-registration/` *(Merchant self-registration & document uploads)*
  2. `Backend/src/features/admin/officer-auth/` *(Revenue officer login & session verification)*
  3. `Backend/src/features/admin/merchant-management/` *(Merchant approvals review & taxpayer directory)*

---

## 2. Scope & Frontend Pages Covered

Your backend modules power the following user flows and pages:

### A. Merchant Registration Portal (`Frontend/ereceipt/src/features/merchant-registration/`)
1. **Multi-step Onboarding**: TIN verification, business details, sector, address, and mandatory document upload.
2. **Document Upload**: Trade license, TIN certificate, ID/Passport.
3. **Registration Status & Sync**: Auto-syncing registration data with merchant profile tab.

### B. Revenue Admin Portal (`Frontend/ereceipt/src/features/admin/`)
1. **Officer Login Screen** (`OfficerLoginForm.tsx`) — Secure revenue officer sign-in (`officer.demo` / `Revenue123`).
2. **Merchant Approvals Queue** (`MerchantApprovals.tsx`) — List of merchant applications with status badges (`Pending`, `Under Review`, `Approved`, `Additional Information Required`, `Rejected`).
3. **Application Review & Decision** (`MerchantApprovalReview.tsx`) — Detailed inspection of submitted business information and document downloads with one-click decision actions (`approve`, `request`, `reject`).
4. **Taxpayers Directory** (`TaxpayersDirectory.tsx`) — Searchable central directory of active/suspended taxpayers, TIN lookups, classification filters (VAT / TOT), and detailed modal view.

---

## 3. Directory & File Structure

```text
Backend/
├── uploads/
│   └── documents/                         # Stored uploaded trade licenses & TIN certs
├── data/
│   ├── registrations.json                 # Submitted merchant registration records
│   └── admin-merchants.json               # Seed & approved merchants directory
└── src/
    └── features/
        ├── merchant-registration/          # [ALREADY IMPLEMENTED]
        │   ├── index.ts
        │   ├── registration.types.ts
        │   ├── registration.storage.ts
        │   ├── registration.service.ts
        │   ├── registration.controller.ts
        │   ├── registration.routes.ts
        │   └── upload.middleware.ts
        └── admin/
            ├── officer-auth/              # [MODULE B: OFFICER AUTH]
            │   ├── index.ts               # Barrel export
            │   ├── auth.types.ts          # Officer credentials & token interfaces
            │   ├── auth.service.ts        # Credential validation & session generation
            │   ├── auth.controller.ts     # Login, me, logout handlers
            │   └── auth.routes.ts         # Express auth endpoints
            └── merchant-management/       # [MODULE C: MERCHANT MANAGEMENT]
                ├── index.ts               # Barrel export
                ├── merchant.types.ts      # Application & Directory item interfaces
                ├── merchant.storage.ts    # JSON storage bridge with registrations.json
                ├── merchant.service.ts    # Approval decision logic & directory query
                ├── merchant.controller.ts # Express request & response handlers
                └── merchant.routes.ts     # Express router endpoints
```

---

## 4. Exact Data Types

Must match the frontend definitions in `Frontend/ereceipt/src/features/admin/types.ts`:

### A. Officer Authentication Types (`auth.types.ts`)
```typescript
export interface OfficerUser {
  id: string;
  username: string;
  name: string;
  badgeNumber: string;
  role: 'REVENUE_OFFICER' | 'SENIOR_AUDITOR' | 'ADMIN';
  email: string;
  branch: string;
}

export interface OfficerLoginRequest {
  username: string;
  password: string;
}

export interface OfficerAuthResponse {
  token: string;
  officer: OfficerUser;
}
```

### B. Merchant Management Types (`merchant.types.ts`)
```typescript
export type DecisionKind = 'approve' | 'request' | 'reject';

export interface DecisionPayload {
  kind: DecisionKind;
  reason: string;
  officerName?: string;
}

export interface MerchantApplicationItem {
  ref: string;              // e.g. "APP-2026-0148"
  registrationId?: string;  // Link to registrations.json
  name: string;             // Business legal name
  tin: string;              // 10-digit TIN
  merchantId: string;       // e.g. "MER-10482"
  category: string;         // e.g. "Retail", "Hospitality", "Pharmacy"
  date: string;             // Submission date, e.g. "20 Oct 2026"
  status: 'Pending' | 'Under Review' | 'Approved' | 'Additional Information Required' | 'Rejected';
  address: string;          // City, Sub-city, Woreda
  contactEmail?: string;
  contactPhone?: string;
  taxType?: 'VAT' | 'TOT';
  documents?: {
    licenseDoc?: string;
    tinDoc?: string;
    idDoc?: string;
  };
}

export interface DirectoryMerchantItem {
  id: string;               // e.g. "MER-10482"
  name: string;             // e.g. "Desta Pharmacy"
  tin: string;              // e.g. "0017932054"
  category: string;         // e.g. "Pharmacy"
  classification: 'VAT' | 'TOT';
  status: 'Active' | 'Suspended';
  authorization: 'Authorized' | 'Suspended';
  registeredDate: string;
  address: string;
}
```

---

## 5. Storage & Initial Seed Data

### A. Officer Credentials (`auth.service.ts`)
Default prototype officer account:
- **Username**: `officer.demo`
- **Password**: `Revenue123`
- **Officer Profile**:
  - `name`: "Hana Alemu"
  - `badgeNumber`: "RO-218"
  - `role`: "REVENUE_OFFICER"
  - `branch`: "Addis Ababa Large Taxpayers Branch"

### B. Merchant Storage (`merchant.storage.ts` & `Backend/data/admin-merchants.json`)
The storage layer should bridge **both**:
1. Live submissions from `Backend/data/registrations.json` (auto-mapped to `MerchantApplicationItem`).
2. Pre-seeded prototype applications:
   - `APP-2026-0148`: "Addis Fresh Supermarket", TIN `0012847391`, Category `Retail`, Status `Pending`.
   - `APP-2026-0147`: "Desta Pharmacy", TIN `0017932054`, Category `Pharmacy`, Status `Under Review`.
   - `APP-2026-0145`: "Blue Nile Stationery", TIN `0014638290`, Category `Wholesale`, Status `Additional Information Required`.
   - `APP-2026-0142`: "Lomi Café and Bakery", TIN `0019274635`, Category `Hospitality`, Status `Approved`.
   - `APP-2026-0139`: "Walia Auto Parts", TIN `0016528347`, Category `Automotive`, Status `Rejected`.
3. Pre-seeded Directory Taxpayers:
   - `MER-10476`: "Lomi Café and Bakery", TIN `0019274635`, VAT, `Active`, `Authorized`.
   - `MER-10468`: "Habesha Textiles SC", TIN `0091247812`, VAT, `Active`, `Authorized`.
   - `MER-10461`: "Sheger Electronics", TIN `0015829471`, TOT, `Active`, `Authorized`.
   - `MER-10452`: "Ethio Mills PLC", TIN `0013958274`, VAT, `Suspended`, `Suspended`.

---

## 6. Shared Audit Logging Bridge

When a Revenue Officer approves, requests info, or rejects a merchant application, the system should log an audit event.

Check if the teammate has created `Backend/src/features/admin/fiscal-oversight/audit-logger.ts`.
- If it exists, call `recordAdminAuditEvent()`.
- If not yet created by teammate, write fallback audit logging to `Backend/data/audit-log-fallback.json` so your application never crashes.

Example audit entry created upon approval:
```json
{
  "officer": "Hana Alemu · RO-218",
  "action": "Merchant approved",
  "reference": "APP-2026-0147",
  "statusTransition": "Under Review → Approved",
  "notes": "Verified business trade license and tax compliance certificate."
}
```

---

## 7. API Endpoints Specification

### A. Officer Authentication Routes (`/api/admin/auth`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/admin/auth/login` | Officer sign-in with username & password. Returns token & officer profile. |
| `GET` | `/api/admin/auth/me` | Validates session token and returns logged-in officer profile. |
| `POST` | `/api/admin/auth/logout` | Clears active session. |

### B. Merchant Approvals & Directory Routes (`/api/admin/merchants`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/merchants/applications` | Returns all merchant onboarding applications with optional `?status=&search=`. |
| `GET` | `/api/admin/merchants/applications/:ref` | Returns complete application details, including uploaded documents list. |
| `POST` | `/api/admin/merchants/applications/:ref/decision` | Submits officer decision (`approve`, `request`, `reject`). If approved, adds merchant to Directory. |
| `GET` | `/api/admin/merchants/directory` | Returns searchable list of registered taxpayers with optional `?search=&category=&classification=`. |
| `GET` | `/api/admin/merchants/directory/:id` | Returns complete merchant profile and authorization details. |
| `PATCH`| `/api/admin/merchants/directory/:id/status` | Toggles merchant status between `Active` and `Suspended`. |

---

## 8. Integration in `Backend/src/app.ts`

Mount the routers in `Backend/src/app.ts`:

```typescript
import { officerAuthRouter } from './features/admin/officer-auth/index.js';
import { merchantManagementRouter } from './features/admin/merchant-management/index.js';

// Mount Feature: Officer Authentication
app.use('/api/admin/auth', officerAuthRouter);

// Mount Feature: Merchant Approvals & Directory
app.use('/api/admin/merchants', merchantManagementRouter);
```

---

## 9. Verification & Quality Checklist

Before finishing:
1. Run `npm run build` in `Backend/` and ensure **0 TypeScript errors**.
2. Start the backend (`npm run dev`) and test with curl or browser:
   - Login: `curl -X POST http://localhost:5000/api/admin/auth/login -H "Content-Type: application/json" -d "{\"username\":\"officer.demo\",\"password\":\"Revenue123\"}"`
   - Applications list: `curl http://localhost:5000/api/admin/merchants/applications`
   - Taxpayers directory: `curl http://localhost:5000/api/admin/merchants/directory`
3. Git commit your files cleanly with descriptive commit messages and push to `origin/Fani`.
