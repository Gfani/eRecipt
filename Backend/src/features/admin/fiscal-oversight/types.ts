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

export interface TaxRecordItem {
  id: string;
  ref: string;
  taxpayerName: string;
  tin: string;
  taxType: 'VAT' | 'TOT';
  taxPeriod: string;
  amountDeclared: number;
  amountCleared: number;
  clearedDate: string;
  status: 'Cleared' | 'Pending' | 'Under Review';
}

export interface OverviewMetrics {
  totalTaxCollected: string;
  activeMerchants: number;
  pendingFilings: number;
  complianceRate: string;
  eimsUptime: string;
  monthlyTargetProgress: number;
}
