export interface MonthlyFinancialRecord {
  key: string;
  month: string;
  income: number;
  expenses: number;
  tax: number;
}

// Zero mock records - all audit records are dynamically derived per merchant from merchantDataStore
export const initialMonthlyRecords: MonthlyFinancialRecord[] = [];
