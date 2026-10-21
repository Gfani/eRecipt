export interface MonthlyFinancialRecord {
  key: string;
  month: string;
  income: number;
  expenses: number;
  tax: number;
}

export const initialMonthlyRecords: MonthlyFinancialRecord[] = [
  { key: "2026-01", month: "January 2026", income: 942500, expenses: 528600, tax: 122935 },
  { key: "2026-02", month: "February 2026", income: 984300, expenses: 554800, tax: 128387 },
  { key: "2026-03", month: "March 2026", income: 1052600, expenses: 593400, tax: 137296 },
  { key: "2026-04", month: "April 2026", income: 1094800, expenses: 611700, tax: 142800 },
  { key: "2026-05", month: "May 2026", income: 1146200, expenses: 642100, tax: 149504 },
  { key: "2026-06", month: "June 2026", income: 1189900, expenses: 663500, tax: 155204 },
  { key: "2026-07", month: "July 2026", income: 1245600, expenses: 691200, tax: 162469 },
  { key: "2026-08", month: "August 2026", income: 1297800, expenses: 708900, tax: 169278 },
  { key: "2026-09", month: "September 2026", income: 1368400, expenses: 754300, tax: 178487 },
  { key: "2026-10", month: "October 2026", income: 1482500, expenses: 826400, tax: 193370 },
];
