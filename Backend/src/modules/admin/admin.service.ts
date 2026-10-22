import { merchantsService } from "../merchants/merchants.service.js";
import { receiptsService } from "../receipts/receipts.service.js";
import { AdminOverviewStats, TaxReportSummary, AdminSalesRecord } from "./admin.types.js";

export class AdminService {
  private taxReports: TaxReportSummary[] = [
    {
      ref: "TR-2026-0918",
      merchantName: "Abyssinia Cloud Tech Solutions PLC",
      tin: "0048192301",
      period: "September 2026",
      grossSales: 1368400.0,
      vatCollected: 178487.0,
      status: "Cleared",
      submissionDate: "05 Oct 2026",
    },
    {
      ref: "TR-2026-0917",
      merchantName: "Abeba Market PLC",
      tin: "0012847391",
      period: "September 2026",
      grossSales: 945000.0,
      vatCollected: 123260.0,
      status: "Cleared",
      submissionDate: "04 Oct 2026",
    },
    {
      ref: "TR-2026-0914",
      merchantName: "Lomi Café and Bakery",
      tin: "0019274635",
      period: "September 2026",
      grossSales: 412000.0,
      vatCollected: 53739.0,
      status: "Pending Review",
      submissionDate: "02 Oct 2026",
    },
    {
      ref: "TR-2026-0909",
      merchantName: "Desta Pharmacy",
      tin: "0017932054",
      period: "August 2026",
      grossSales: 689000.0,
      vatCollected: 89869.0,
      status: "Audit Flagged",
      submissionDate: "15 Sep 2026",
    },
  ];

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

    const totalVat = receipts.reduce((sum, r) => sum + r.taxAmount, 0) + 445355.0; // Seed + dynamic
    const totalSales = receipts.reduce((sum, r) => sum + r.totalAmount, 0) + 3414400.0;

    return {
      totalApplications: apps.length,
      pendingReviews: pending,
      underReviewCount: underReview,
      approvedCount: approved,
      rejectedCount: rejected,
      totalVatClearedThisMonth: totalVat,
      totalSalesVolumeThisMonth: totalSales,
      activeMerchantsCount: approved + 24, // demo base active taxpayers
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
