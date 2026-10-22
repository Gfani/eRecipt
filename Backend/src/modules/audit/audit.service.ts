import { MonthlyFinancialRecord, TaxCalculationResponse, AuditLogEvent } from "./audit.types.js";
import { AuditFilterInput, ApproveTaxInput } from "./audit.schema.js";

export class AuditService {
  private monthlyRecords: MonthlyFinancialRecord[] = [
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

  private auditLogs: AuditLogEvent[] = [
    {
      id: "ev-1",
      timestamp: "18 Oct 2026 14:22",
      user: "officer.demo (Revenue Officer)",
      role: "officer",
      action: "MERCHANT_APPLICATION_DECISION",
      resource: "APP-2026-0148 (Meklit Home Goods PLC)",
      ipAddress: "197.156.104.12",
    },
    {
      id: "ev-2",
      timestamp: "18 Oct 2026 11:05",
      user: "officer.demo (Revenue Officer)",
      role: "officer",
      action: "TAX_REPORT_REVIEW",
      resource: "TR-2026-0918 (Abyssinia Cloud Tech)",
      ipAddress: "197.156.104.12",
    },
    {
      id: "ev-3",
      timestamp: "17 Oct 2026 16:40",
      user: "system_scheduler",
      role: "system",
      action: "VAT_CLEARANCE_BATCH_SYNC",
      resource: "MoR EIMS Batch #892",
      ipAddress: "10.0.4.1",
    },
    {
      id: "ev-4",
      timestamp: "16 Oct 2026 09:12",
      user: "officer.demo (Revenue Officer)",
      role: "officer",
      action: "MERCHANT_APPLICATION_APPROVED",
      resource: "APP-2026-0142 (Lomi Café and Bakery)",
      ipAddress: "197.156.104.12",
    },
  ];

  /**
   * Filter monthly financial records by date range
   */
  async getMonthlyRecords(filter: AuditFilterInput): Promise<MonthlyFinancialRecord[]> {
    const startKey = filter.startDate.slice(0, 7);
    const endKey = filter.endDate.slice(0, 7);

    return this.monthlyRecords.filter(
      (record) => record.key >= startKey && record.key <= endKey
    );
  }

  /**
   * Compute aggregated tax calculations for a given range
   */
  async calculateTaxPeriod(filter: AuditFilterInput): Promise<TaxCalculationResponse> {
    const records = await this.getMonthlyRecords(filter);
    const totalIncome = records.reduce((sum, r) => sum + r.income, 0);
    const totalExpenses = records.reduce((sum, r) => sum + r.expenses, 0);
    const totalTax = records.reduce((sum, r) => sum + r.tax, 0);

    return {
      startDate: filter.startDate,
      endDate: filter.endDate,
      monthsCount: records.length,
      totalIncome,
      totalExpenses,
      totalTax,
      records,
    };
  }

  /**
   * Approve calculated tax for the period
   */
  async approveTax(input: ApproveTaxInput, userIdentifier: string) {
    const logEntry: AuditLogEvent = {
      id: `ev-${Date.now()}`,
      timestamp: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      user: userIdentifier,
      role: "merchant",
      action: "TAX_DECLARATION_APPROVED",
      resource: `Period ${input.startDate} to ${input.endDate} (ETB ${input.approvedAmount.toFixed(2)})`,
      ipAddress: "127.0.0.1",
    };

    this.auditLogs.unshift(logEntry);

    return {
      success: true,
      approvedAmount: input.approvedAmount,
      approvedAt: new Date().toISOString(),
      auditLogId: logEntry.id,
    };
  }

  /**
   * Get system-wide audit trail logs
   */
  async getAuditLogs(): Promise<AuditLogEvent[]> {
    return this.auditLogs;
  }
}

export const auditService = new AuditService();
