# FANUEL BACKEND TASK SPECIFICATION & INTEGRATION GUIDE

> **PROJECT**: eReceipt · Digital Tax & Receipt Administration System  
> **LEAD DEVELOPER**: Fanuel Goitom (`Fani` branch)  
> **SCOPE**: Merchant Registration, Merchant JWT Authentication, Revenue Officer 2FA Authentication, Merchant Approvals & Taxpayer Directory, and OTP Verification Engine.

---

## 1. System Overview & Assigned Domain

The backend is built with **Node.js, Express, and TypeScript (ESM / NodeNext)** in `Backend/src/`.  
As Developer 1 (Fanuel), your scope encompasses all core identity, onboarding, and merchant oversight pipelines:

1. **Merchant Onboarding & Accreditation**: 5-step digital business registration with TIN validation, document attachment, and certified submission.
2. **Merchant JWT Authentication & Signed Sessions**: Cryptographic password hashing, signed JWT bearer session issuance, and email verification gating.
3. **Revenue Officer Two-Factor Authentication (2FA)**: High-security officer sign-in with 6-digit one-time code dispatch via Resend under eReceipt branding and 10-minute validity.
4. **Merchant Approvals & Taxpayer Directory**: MoR administrative queue for vetting applicant documents, issuing accreditation decisions, and querying the national taxpayer directory.
5. **Secure OTP Verification Service**: HMAC-SHA256 hashed code caching, rate-limiting cooldown, and tamper-proof verification.

---

## 2. Architecture & File Structure

```text
Backend/
└── src/
    ├── common/
    │   ├── authToken.ts                   # Signed JWT generation & verification
    │   └── errors.ts                      # Standard domain HTTP errors
    ├── config/
    │   └── index.ts                       # Environment & JWT secret configurations
    ├── middleware/
    │   ├── authMiddleware.ts              # Bearer token verification middleware
    │   └── errorHandler.ts                # Global error handling
    ├── services/
    │   └── otp.service.ts                 # OTP generator, Resend delivery & hashed validation
    ├── features/
    │   ├── merchant-registration/         # [MODULE A: MERCHANT REGISTRATION]
    │   │   ├── index.ts                   # Router barrel export
    │   │   ├── types.ts                   # Registration form & storage interfaces
    │   │   ├── storage.ts                 # JSON persistence bridge (registrations.json)
    │   │   ├── password.ts                # Cryptographic password hashing & verification
    │   │   ├── registration.service.ts    # TIN format checks & verified email gating
    │   │   ├── registration.controller.ts # Express request & response handlers
    │   │   ├── registration.routes.ts     # Express router endpoints
    │   │   └── upload.middleware.ts       # Multer document upload handler
    │   └── admin/
    │       ├── officer-auth/              # [MODULE B: OFFICER 2FA AUTH]
    │       │   ├── index.ts               # Barrel export
    │       │   ├── auth.types.ts          # Officer credentials & 2FA interfaces
    │       │   ├── auth.service.ts        # 2FA challenge, verification & credential store
    │       │   ├── auth.controller.ts     # Login, 2FA verify, resend & logout handlers
    │       │   └── auth.routes.ts         # Express auth endpoints
    │       └── merchant-management/       # [MODULE C: MERCHANT APPROVALS & DIRECTORY]
    │           ├── index.ts               # Barrel export
    │           ├── merchant.types.ts      # Application & Directory item interfaces
    │           ├── merchant.storage.ts    # JSON storage bridge with registrations.json
    │           ├── merchant.service.ts    # Approval decision logic & directory query
    │           ├── merchant.controller.ts # Express request & response handlers
    │           └── merchant.routes.ts     # Express router endpoints
    └── modules/
        └── auth/                          # [MODULE D: MERCHANT AUTHENTICATION]
            ├── auth.schema.ts             # Zod validation schemas
            ├── auth.types.ts              # Merchant auth responses
            ├── auth.service.ts            # Password comparison & token issuance
            ├── auth.controller.ts         # Express controller
            └── auth.routes.ts             # /api/auth endpoints
```

---

## 3. Data Models & TypeScript Interfaces

### A. Merchant Registration & Storage (`types.ts`)
```typescript
export interface StoredMerchantApplication {
  id: string;
  referenceNumber: string;         // e.g. "APP-2026-4821"
  fullName: string;
  phoneNumber: string;
  email: string;
  emailVerified: boolean;
  passwordHash: string;            // Hashed via PBKDF2/scrypt
  sellerLegalName: string;
  tradeName: string;
  tin: string;                     // Exactly 10 numeric digits
  businessLicenseNumber: string;
  city: string;
  subCity: string;
  buildingName: string;
  floor?: string;
  gpsLocation?: string;
  documentFileUrl?: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Additional Information Required' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}
```

### B. Merchant JWT Auth Types (`auth.types.ts`)
```typescript
export interface MerchantLoginInput {
  tin: string;
  password: string;
  rememberMe?: boolean;
}

export interface MerchantAuthResponse {
  token: string;                   // Signed JWT token
  user: {
    id: string;
    role: 'merchant';
    tin: string;
    businessName: string;
    tradeName: string;
    status: string;
  };
}
```

### C. Officer 2FA Authentication Types (`officer-auth/auth.types.ts`)
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

export interface OfficerAuthResponse {
  requires2FA?: boolean;
  tempToken?: string;
  maskedEmail?: string;
  token?: string;
  officer?: OfficerUser;
}
```

### D. Merchant Management & Directory Types (`merchant.types.ts`)
```typescript
export type DecisionKind = 'approve' | 'request' | 'reject';

export interface DecisionPayload {
  kind: DecisionKind;
  reason: string;
  officerName?: string;
}

export interface MerchantApplicationItem {
  ref: string;
  registrationId?: string;
  name: string;
  tin: string;
  merchantId: string;
  category: string;
  date: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Additional Information Required' | 'Rejected';
  address: string;
  contactEmail?: string;
  contactPhone?: string;
  taxType?: 'VAT' | 'TOT';
}

export interface DirectoryMerchantItem {
  id: string;
  name: string;
  tin: string;
  category: string;
  classification: 'VAT' | 'TOT';
  status: 'Active' | 'Suspended';
  authorization: 'Authorized' | 'Suspended';
  registeredDate: string;
  address: string;
}
```

---

## 4. Security & Privacy Policies

1. **OTP Privacy**:
   - OTP codes are **never** returned in HTTP response bodies (`code` and `simulatedCode` fields omitted).
   - Dev OTP code helper chips are removed from production-facing UIs.
   - Codes expire strictly after **10 minutes** (`EXPIRY_MINUTES = 10`).
2. **Email Dispatch**:
   - Sent through Resend under **`eReceipt`** sender branding (`eReceipt <onboarding@resend.dev>`).
   - Clean subject formatting: `eReceipt · Verification Code: ######`.
   - UI copy uses clean phrasing ("A verification code has been sent", "Resend code") without exposing internal email transport vendor names.
3. **Password Protection**:
   - Merchant passwords hashed using PBKDF2/scrypt before persistence in `data/registrations.json`.
4. **Registration Gate**:
   - An application cannot be submitted unless `otpService.consumeVerifiedEmail(email, 'merchant_registration')` confirms successful verification.

---

## 5. Complete API Endpoints Specification

### A. Merchant Registration & TIN (`/api/registration`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/registration/check-tin/:tin` | Validates 10-digit Ethiopian TIN format and ensures uniqueness. |
| `POST` | `/api/registration/submit` | Multipart form submission (fields + license document). Enforces email verification gate. |
| `GET` | `/api/registration/status/:ref` | Queries application review status and assigned registration reference. |

### B. Merchant Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/merchant/login` | Authenticates merchant via TIN and password. Returns signed JWT bearer session. |
| `GET` | `/api/auth/me` | Validates bearer token header (`Authorization: Bearer <token>`) and returns session user. |

### C. OTP Verification Service (`/api/otp`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/otp/send` | Generates 6-digit code, stores HMAC hash, dispatches branded email. Enforces 45s cooldown. |
| `POST` | `/api/otp/verify` | Validates code hash within 10-minute expiry window. Consumes code upon success. |

### D. Revenue Officer 2FA Authentication (`/api/admin/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/admin/auth/login` | Validates username/password, issues temporary 2FA token, and dispatches 6-digit OTP. |
| `POST` | `/api/admin/auth/verify-2fa` | Verifies 2FA security code and returns officer access token. |
| `POST` | `/api/admin/auth/resend-2fa` | Re-sends 2FA code to officer's registered email with cooldown. |
| `GET` | `/api/admin/auth/me` | Returns logged-in officer profile from active token. |
| `POST` | `/api/admin/auth/logout` | Clears active session. |

### E. Merchant Approvals & Taxpayer Directory (`/api/admin/merchants`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/merchants/applications` | Returns all onboarding applications with optional `?status=&search=`. |
| `GET` | `/api/admin/merchants/applications/:ref` | Returns detailed application data including uploaded license document URL. |
| `POST` | `/api/admin/merchants/applications/:ref/decision` | Submits approval, request info, or rejection. Automatically adds approved merchant to Directory. |
| `GET` | `/api/admin/merchants/directory` | Searchable list of accredited taxpayers with filter options. |
| `GET` | `/api/admin/merchants/directory/:id` | Returns complete merchant profile and tax compliance status. |
| `PATCH`| `/api/admin/merchants/directory/:id/status` | Toggles merchant status between `Active` and `Suspended`. |

---

## 6. Seed Accounts & Credentials

### Officer Accounts (`Backend/data/admin-officers.json`)
- **Default Officer**: `officer.fani` / `Revenue123`
  - Name: "Fanuel Goitom"
  - Badge: "RO-218"
  - Role: "SENIOR_AUDITOR"
  - Email: `fanuelgoitom79@gmail.com` (Verified for Resend delivery)
  - Branch: "Addis Ababa Large Taxpayers Branch"

### Approved Merchant Account
- **TIN**: `0019274635`
- **Legal Name**: "Lomi Café and Bakery"
- **Status**: "Approved"
- **Category**: "Hospitality" (VAT)

---

## 7. Verification & Quality Checklist

1. **Backend Build**: `npm run build` in `Backend/` must succeed with **0 TypeScript errors**.
2. **Frontend Build**: `npm run build` in `Frontend/ereceipt/` must succeed with **0 errors**.
3. **Curl Testing**:
   ```bash
   # 1. Health check
   curl http://localhost:5000/api/health

   # 2. Officer 2FA Login
   curl -X POST http://localhost:5000/api/admin/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"officer.fani","password":"Revenue123"}'

   # 3. Merchant Applications Queue
   curl http://localhost:5000/api/admin/merchants/applications

   # 4. Taxpayers Directory
   curl http://localhost:5000/api/admin/merchants/directory
   ```
4. **Git Workflow**: Always commit and push to branch `Fani` (`origin/Fani`).
