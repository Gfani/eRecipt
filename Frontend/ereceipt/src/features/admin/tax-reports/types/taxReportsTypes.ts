export interface AdminTaxReportItem {
  id: string;
  merchantName: string;
  tradeName: string;
  tin: string;
  period: string;
  declaredSales: number;
  declaredExpenses: number;
  calculatedTax: number;
  filingStatus: 'reconciled' | 'payment_pending' | 'discrepancy_flagged';
  filedDate: string;
}
