import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { merchantManagementStorage } from './merchant.storage.js';
import type {
  MerchantApplicationItem,
  DirectoryMerchantItem,
  DecisionPayload,
  ApplicationQuery,
  DirectoryQuery,
  ApplicationReviewStatus,
} from './merchant.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../../../data');
const AUDIT_FILE = path.join(DATA_DIR, 'admin-audit-log.json');

/**
 * Persists an audit entry to the shared audit trail
 */
function recordAuditEvent(entry: {
  officer: string;
  action: string;
  reference: string;
  statusTransition: string;
  notes: string;
}) {
  try {
    const timestamp = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const fullEvent = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
      ...entry,
    };

    let events: any[] = [];
    if (fs.existsSync(AUDIT_FILE)) {
      try {
        events = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
      } catch {
        events = [];
      }
    }

    events.unshift(fullEvent);
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(events, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to record audit event:', err);
  }
}

export class MerchantManagementService {
  /**
   * Get all merchant onboarding applications
   */
  async listApplications(query?: ApplicationQuery): Promise<MerchantApplicationItem[]> {
    return merchantManagementStorage.getApplications(query);
  }

  /**
   * Get single application by reference number
   */
  async getApplication(ref: string): Promise<MerchantApplicationItem> {
    const app = merchantManagementStorage.getApplicationByRef(ref);
    if (!app) {
      throw new Error(`Merchant application with reference "${ref}" not found.`);
    }
    return app;
  }

  /**
   * Process officer decision (approve, request, reject)
   */
  async submitDecision(ref: string, payload: DecisionPayload): Promise<{
    application: MerchantApplicationItem;
    directoryRecord?: DirectoryMerchantItem;
    message: string;
  }> {
    const current = merchantManagementStorage.getApplicationByRef(ref);
    if (!current) {
      throw new Error(`Merchant application with reference "${ref}" not found.`);
    }

    const officerName = payload.officerName?.trim() || 'Hana Alemu · RO-218';
    const reason = payload.reason?.trim() || (payload.kind === 'approve' ? 'Verification checks completed' : 'Administrative review action');

    let nextStatus: ApplicationReviewStatus;
    let actionText: string;

    switch (payload.kind) {
      case 'approve':
        nextStatus = 'Approved';
        actionText = 'Merchant approved';
        break;
      case 'request':
        nextStatus = 'Additional Information Required';
        actionText = 'Additional information requested';
        break;
      case 'reject':
        nextStatus = 'Rejected';
        actionText = 'Merchant rejected';
        break;
      default:
        throw new Error(`Invalid decision kind "${payload.kind}". Must be 'approve', 'request', or 'reject'.`);
    }

    const previousStatus = current.status;
    const updatedApplication = merchantManagementStorage.updateApplicationStatus(
      ref,
      nextStatus,
      officerName,
      reason
    );

    if (!updatedApplication) {
      throw new Error(`Failed to update application "${ref}".`);
    }

    let directoryRecord: DirectoryMerchantItem | undefined;

    // If approved, automatically register into central Taxpayers Directory
    if (nextStatus === 'Approved') {
      const nowFormatted = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      const newTaxpayer: DirectoryMerchantItem = {
        id: updatedApplication.merchantId,
        name: updatedApplication.name,
        tin: updatedApplication.tin,
        category: updatedApplication.category,
        classification: 'VAT', // Default MoR standard classification
        status: 'Active',
        authorization: 'Authorized',
        registeredDate: nowFormatted,
        address: updatedApplication.address,
        contactPhone: updatedApplication.phoneNumber,
        vatRegistrationNumber: `VAT-ET-${new Date().getFullYear()}-${updatedApplication.tin.slice(-4)}`,
        monthlySalesAvg: 0,
      };

      directoryRecord = merchantManagementStorage.addDirectoryMerchant(newTaxpayer);
    }

    // Record in central audit log
    recordAuditEvent({
      officer: officerName,
      action: actionText,
      reference: ref,
      statusTransition: `${previousStatus} → ${nextStatus}`,
      notes: reason,
    });

    return {
      application: updatedApplication,
      directoryRecord,
      message: `Application ${ref} successfully updated to "${nextStatus}".`,
    };
  }

  /**
   * List approved merchants in directory
   */
  async listDirectory(query?: DirectoryQuery): Promise<DirectoryMerchantItem[]> {
    return merchantManagementStorage.getDirectory(query);
  }

  /**
   * Get directory merchant details
   */
  async getDirectoryMerchant(id: string): Promise<DirectoryMerchantItem> {
    const merchant = merchantManagementStorage.getDirectoryMerchantById(id);
    if (!merchant) {
      throw new Error(`Merchant with identifier "${id}" not found in directory.`);
    }
    return merchant;
  }

  /**
   * Toggle merchant status between Active and Suspended
   */
  async updateStatus(
    id: string,
    status: 'Active' | 'Suspended',
    officerName?: string,
    reason?: string
  ): Promise<DirectoryMerchantItem> {
    const updated = merchantManagementStorage.updateDirectoryStatus(id, status);
    if (!updated) {
      throw new Error(`Merchant "${id}" not found.`);
    }

    // Log status change
    recordAuditEvent({
      officer: officerName || 'Hana Alemu · RO-218',
      action: 'Receipt authorization changed',
      reference: updated.id,
      statusTransition: `Status changed to ${status}`,
      notes: reason || `Administrative status change to ${status}`,
    });

    return updated;
  }
}

export const merchantManagementService = new MerchantManagementService();
