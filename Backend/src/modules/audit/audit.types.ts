export interface MonthlyFinancialRecord {
  key: string; // e.g. "2026-01"
  month: string; // e.g. "January 2026"
  income: number;
  expenses: number;
  tax: number;
}

export interface TaxCalculationResponse {
  startDate: string;
  endDate: string;
  monthsCount: number;
  totalIncome: number;
  totalExpenses: number;
  totalTax: number;
  records: MonthlyFinancialRecord[];
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  user: string;
  role: "merchant" | "officer" | "admin" | "system";
  action: string;
  resource: string;
  ipAddress: string;
}
