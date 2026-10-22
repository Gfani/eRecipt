export interface AdminOverviewStats {
  totalApplications: number;
  pendingReviews: number;
  underReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalVatClearedThisMonth: number;
  totalSalesVolumeThisMonth: number;
  activeMerchantsCount: number;
}

export interface TaxReportSummary {
  ref: string;
  merchantName: string;
  tin: string;
  period: string;
  grossSales: number;
  vatCollected: number;
  status: "Cleared" | "Pending Review" | "Audit Flagged";
  submissionDate: string;
}

export interface AdminSalesRecord {
  id: string;
  receiptNumber: string;
  merchantName: string;
  tin: string;
  date: string;
  totalAmount: number;
  taxAmount: number;
  paymentMethod: string;
  status: string;
}
