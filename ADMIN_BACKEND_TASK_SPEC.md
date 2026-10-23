# PROMPT SPECIFICATION FOR AI AGENT: Admin Fiscal Oversight & Audit Backend

> **INSTRUCTIONS FOR THE AGENT:**  
> You are working on the **eReceipt** Digital Receipt & Tax Administration System backend.  
> Read this document carefully and execute the task autonomously. Do NOT modify any existing files outside your assigned module.

---

## 1. Project Context & Division of Work
The backend is built with **Node.js, Express, and TypeScript (ESM / NodeNext)** in `Backend/`.
The project is divided between two backend developers:

- **Developer 1 (Fanuel)**: Merchant Registration, Officer Authentication, and Merchant Approvals & Taxpayer Directory.
- **Developer 2 (YOU)**: **Fiscal Oversight, Tax Reports, Sales Records & Audit Trail**.

### Strict Collaboration Rule:
- ⛔ **DO NOT** edit, overwrite, or delete any files inside `Backend/src/features/merchant-registration/`.
- 📁 **ALL YOUR WORK** must be contained strictly inside:  
  `Backend/src/features/admin/fiscal-oversight/`

---

## 2. Scope & Frontend Pages Covered
Your backend module will power these specific pages of the Revenue Admin Portal (`Frontend/ereceipt/src/features/admin/`):
1. **Overview Dashboard** (`AdminOverview.tsx`) — National revenue KPI metrics & statistics.
2. **Tax Reports** (`TaxReports.tsx` & `TaxReportReview.tsx`) — Review monthly VAT & TOT tax filings from merchants.
3. **Sales Records** (`SalesRecords.tsx`) — Fiscal sales transaction ledger.
4. **Tax Records Ledger** (`TaxRecordsLedger.tsx`) — MoR central repository of cleared taxes.
5. **Fiscal Audit Trail** (`AdminAuditLog.tsx`) — Chronological security audit logs of all officer decisions.

---

## 3. Directory & File Structure to Create

Create only the following files in `Backend/src/features/admin/fiscal-oversight/`:

```text
Backend/
└── src/
    └── features/
        └── admin/
            └── fiscal-oversight/
                ├── index.ts              # Clean barrel export
                ├── types.ts              # TypeScript interfaces matching frontend
                ├── storage.ts            # Persistent JSON file storage & initial prototype data
                ├── audit-logger.ts       # Shared audit recording helper function
                ├── fiscal.service.ts     # Business logic & calculations
                ├── fiscal.controller.ts  # Express request & response handlers
                └── fiscal.routes.ts      # Express router endpoints
```

---

## 4. Exact Data Types (`types.ts`)
Must match the frontend definitions in `Frontend/ereceipt/src/features/admin/types.ts`:

```typescript
export type DecisionKind = 'approve' | 'request' | 'reject';

export interface DecisionPayload {
  kind: DecisionKind;
  reason: string;
  officerName?: string;
}

export interface TaxReportItem {
  ref: string;          // e.g. "TR-2026-0918"
  name: string;         // e.g. "Meklit Home Goods PLC"
  tin: string;          // e.g. "0012847391"
  period: string;       // e.g. "September 2026"
  category: 'VAT' | 'TOT';
  sales: number;        // e.g. 1480000
  tax: number;          // e.g. 222000
  date: string;         // e.g. "18 Oct 2026"
  status: 'Pending' | 'Approved' | 'Additional Information Required' | 'Rejected';
  notes?: string;
}

export interface AuditEventItem {
  id?: string;
  timestamp: string;        // e.g. "22 Oct 2026, 14:30"
  officer: string;          // e.g. "Hana Alemu · RO-218"
  action: string;           // e.g. "Tax report approved"
  reference: string;        // e.g. "TR-2026-0918"
  statusTransition: string; // e.g. "Pending Review → Approved"
  notes: string;
}

export interface SalesRecordItem {
  id: string;
  receiptNumber: string;
  merchantName: string;
  tin: string;
  date: string;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  paymentMethod: string;
  status: 'Cleared' | 'Voided';
}

export interface OverviewMetrics {
  totalTaxCollected: string;
  activeMerchants: number;
  pendingFilings: number;
  complianceRate: string;
  eimsUptime: string;
  monthlyTargetProgress: number;
}
```

---

## 5. Storage & Initial Prototype Data (`storage.ts`)

Store data in `Backend/data/admin-fiscal-data.json` so data persists across restarts, with initial realistic Ethiopian revenue data:

1. **Initial Tax Reports**:
   - `TR-2026-0918`: Meklit Home Goods PLC, TIN `0012847391`, Sept 2026, Category `VAT`, Sales `1480000`, Tax `222000`, Status `Pending`.
   - `TR-2026-0917`: Desta Pharmacy, TIN `0049102847`, Sept 2026, Category `TOT`, Sales `620000`, Tax `12400`, Status `Approved`.
   - `TR-2026-0916`: Habesha Textiles SC, TIN `0091247812`, Sept 2026, Category `VAT`, Sales `3100000`, Tax `465000`, Status `Pending`.

2. **Initial Audit Events**:
   - `22 Oct 2026, 10:15`: Hana Alemu · RO-218 | `Tax report approved` | `TR-2026-0917` | `Pending Review → Approved` | `Reconciliation verified against monthly bank deposit slips`.
   - `21 Oct 2026, 16:40`: Hana Alemu · RO-218 | `Information requested` | `TR-2026-0915` | `Pending Review → Additional Information Required` | `Discrepancy in exempt sales documentation`.

---

## 6. Shared Audit Logger Function (`audit-logger.ts`)

Export this function so any officer action can append to the audit log:

```typescript
import { fiscalStorage } from './storage.js';
import type { AuditEventItem } from './types.js';

export function recordAdminAuditEvent(entry: Omit<AuditEventItem, 'timestamp'> & { timestamp?: string }): AuditEventItem {
  const timestamp = entry.timestamp || new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const fullEvent: AuditEventItem = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    officer: entry.officer,
    action: entry.action,
    reference: entry.reference,
    statusTransition: entry.statusTransition,
    notes: entry.notes,
  };

  fiscalStorage.addAuditEvent(fullEvent);
  return fullEvent;
}
```

---

## 7. API Endpoints Specification (`fiscal.routes.ts`)

Router prefix: `/api/admin/fiscal`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/overview` | Returns `OverviewMetrics` (KPI counts for Executive Dashboard). |
| `GET` | `/reports` | List tax reports with optional filters `?status=&category=&search=`. |
| `GET` | `/reports/:ref` | Get single tax report details. |
| `POST` | `/reports/:ref/decision` | Submit officer review decision (`approve`, `request`, `reject`) with reason. Updates report status and automatically writes to Audit Trail. |
| `GET` | `/sales-records` | List national sales records ledger with optional `?tin=&page=`. |
| `GET` | `/tax-records` | Central MoR tax ledger data. |
| `GET` | `/audit-logs` | Chronological list of `AuditEventItem[]`. |

---

## 8. Integration in `Backend/src/app.ts`

Mount the router in `Backend/src/app.ts`:

```typescript
import { fiscalOversightRouter } from './features/admin/fiscal-oversight/index.js';

// Mount Feature: Admin Fiscal Oversight & Audit
app.use('/api/admin/fiscal', fiscalOversightRouter);
```

---

## 9. Verification & Quality Checklist
Before finishing:
1. Run `npm run build` in `Backend/` and verify **0 TypeScript errors**.
2. Start or check the server (`npm run dev`) and test these URLs in your browser or curl:
   - `http://localhost:5000/api/admin/fiscal/overview`
   - `http://localhost:5000/api/admin/fiscal/reports`
   - `http://localhost:5000/api/admin/fiscal/audit-logs`
3. Git commit your files cleanly inside `Backend/src/features/admin/fiscal-oversight/`.
