import { merchantsService } from "../merchants/merchants.service.js";
import { receiptsService } from "../receipts/receipts.service.js";
import { AdminOverviewStats, TaxReportSummary, AdminSalesRecord } from "./admin.types.js";

export class AdminService {
  private taxReports: TaxReportSummary[] = [];

  /**
   * Aggregated officer dashboard metrics
   */
  async getOverviewStats(): Promise<AdminOverviewStats> {
    const apps = await merchantsService.getAllApplications();
    const receipts = await receiptsService.getReceipts();

    const pending = apps.filter((a) => a.status === "Pending").length;
    const underReview = apps.filter((a) => a.status === "Under Review").length;
    const approved = apps.filter((a) => a.status === "Approved").length;
    const rejected = apps.filter((a) => a.status === "Rejected").length;

    const totalVat = receipts.reduce((sum, r) => sum + r.taxAmount, 0);
    const totalSales = receipts.reduce((sum, r) => sum + r.totalAmount, 0);

    return {
      totalApplications: apps.length,
      pendingReviews: pending,
      underReviewCount: underReview,
      approvedCount: approved,
      rejectedCount: rejected,
      totalVatClearedThisMonth: totalVat,
      totalSalesVolumeThisMonth: totalSales,
      activeMerchantsCount: approved,
    };
  }

  /**
   * Tax report submissions ledger
   */
  async getTaxReports(): Promise<TaxReportSummary[]> {
    return this.taxReports;
  }

  /**
   * Cross-merchant sales records ledger
   */
  async getSalesRecords(): Promise<AdminSalesRecord[]> {
    const receipts = await receiptsService.getReceipts();
    return receipts.map((r) => ({
      id: r.id,
      receiptNumber: r.receiptNumber,
      merchantName: r.merchantName,
      tin: r.merchantTin,
      date: r.createdAt,
      totalAmount: r.totalAmount,
      taxAmount: r.taxAmount,
      paymentMethod: r.paymentMethod,
      status: r.status,
    }));
  }
}

export const adminService = new AdminService();
