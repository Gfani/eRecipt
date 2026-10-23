import { fiscalStorage } from './storage.js';
import { recordAdminAuditEvent } from './audit-logger.js';
import type {
  OverviewMetrics,
  TaxReportItem,
  DecisionPayload,
  SalesRecordItem,
  TaxRecordItem,
  AuditEventItem,
} from './types.js';

export class FiscalService {
  public getOverviewMetrics(): OverviewMetrics {
    return fiscalStorage.getOverviewMetrics();
  }

  public getTaxReports(filters?: {
    status?: string;
    category?: string;
    search?: string;
  }): TaxReportItem[] {
    return fiscalStorage.getReports(filters);
  }

  public getTaxReportByRef(ref: string): TaxReportItem | undefined {
    return fiscalStorage.getReportByRef(ref);
  }

  public processReportDecision(
    ref: string,
    payload: DecisionPayload
  ): { success: boolean; report?: TaxReportItem; message?: string } {
    const report = fiscalStorage.getReportByRef(ref);
    if (!report) {
      return { success: false, message: `Tax report ${ref} not found` };
    }

    const previousStatus = report.status;
    let nextStatus: TaxReportItem['status'] = 'Pending';
    let actionDesc = 'Tax report decision';

    switch (payload.kind) {
      case 'approve':
        nextStatus = 'Approved';
        actionDesc = 'Tax report approved';
        break;
      case 'request':
        nextStatus = 'Additional Information Required';
        actionDesc = 'Additional information requested for tax report';
        break;
      case 'reject':
        nextStatus = 'Rejected';
        actionDesc = 'Tax report rejected';
        break;
      default:
        return { success: false, message: `Invalid decision kind: ${payload.kind}` };
    }

    const updated = fiscalStorage.updateReportStatus(ref, nextStatus, payload.reason);
    if (!updated) {
      return { success: false, message: `Failed to update status for ${ref}` };
    }

    const officer = payload.officerName || 'Revenue Officer (Authenticated)';
    recordAdminAuditEvent({
      officer,
      action: actionDesc,
      reference: ref,
      statusTransition: `${previousStatus} → ${nextStatus}`,
      notes: payload.reason || `Decision '${payload.kind}' recorded by ${officer}`,
    });

    return { success: true, report: updated };
  }

  public getSalesRecords(filters?: { tin?: string }): SalesRecordItem[] {
    return fiscalStorage.getSalesRecords(filters);
  }

  public getTaxRecords(): TaxRecordItem[] {
    return fiscalStorage.getTaxRecords();
  }

  public getAuditLogs(): AuditEventItem[] {
    return fiscalStorage.getAuditEvents();
  }
}

export const fiscalService = new FiscalService();
