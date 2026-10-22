export interface MonthlyTransactionSummary {
  id: string;
  month: string;      // e.g., "October"
  year: string;       // e.g., "2026"
  totalIncome: number;// 1482500.00
  totalTax: number;   // 193370.00
  expenses: number;   // 826400.00
}