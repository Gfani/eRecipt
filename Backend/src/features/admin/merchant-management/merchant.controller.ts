import type { Request, Response } from 'express';
import { merchantManagementService } from './merchant.service.js';
import { officerAuthService } from '../officer-auth/index.js';

export class MerchantManagementController {
  /**
   * GET /api/admin/merchants/applications
   */
  async getApplications(req: Request, res: Response): Promise<void> {
    try {
      const { status, search } = req.query;
      const applications = await merchantManagementService.listApplications({
        status: status ? String(status) : undefined,
        search: search ? String(search) : undefined,
      });

      res.status(200).json({
        success: true,
        count: applications.length,
        data: applications,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to retrieve merchant applications',
      });
    }
  }

  /**
   * GET /api/admin/merchants/applications/:ref
   */
  async getApplication(req: Request, res: Response): Promise<void> {
    try {
      const ref = String(req.params.ref);
      const application = await merchantManagementService.getApplication(ref);

      res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message || `Application ${req.params.ref} not found`,
      });
    }
  }

  /**
   * POST /api/admin/merchants/applications/:ref/decision
   */
  async submitDecision(req: Request, res: Response): Promise<void> {
    try {
      const ref = String(req.params.ref);
      const { kind, reason, officerName } = req.body;

      if (!kind || !['approve', 'request', 'reject'].includes(kind)) {
        res.status(400).json({
          success: false,
          error: 'Field "kind" is required and must be one of: "approve", "request", "reject".',
        });
        return;
      }

      let activeOfficer = officerName;
      if (!activeOfficer && req.headers.authorization) {
        const off = await officerAuthService.getOfficerFromToken(req.headers.authorization);
        if (off) {
          activeOfficer = `${off.name} · ${off.badgeNumber}`;
        }
      }

      const result = await merchantManagementService.submitDecision(ref, {
        kind,
        reason: reason || '',
        officerName: activeOfficer || 'Revenue Compliance Officer',
      });

      res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to process application decision',
      });
    }
  }

  /**
   * GET /api/admin/merchants/directory
   */
  async getDirectory(req: Request, res: Response): Promise<void> {
    try {
      const { search, category, classification, status } = req.query;
      const merchants = await merchantManagementService.listDirectory({
        search: search ? String(search) : undefined,
        category: category ? String(category) : undefined,
        classification: classification ? String(classification) : undefined,
        status: status ? String(status) : undefined,
      });

      res.status(200).json({
        success: true,
        count: merchants.length,
        data: merchants,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to retrieve taxpayers directory',
      });
    }
  }

  /**
   * GET /api/admin/merchants/directory/:id
   */
  async getDirectoryMerchant(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const merchant = await merchantManagementService.getDirectoryMerchant(id);

      res.status(200).json({
        success: true,
        data: merchant,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message || `Merchant "${req.params.id}" not found`,
      });
    }
  }

  /**
   * PATCH /api/admin/merchants/directory/:id/status
   */
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { status, officerName, reason } = req.body;

      if (!status || !['Active', 'Suspended'].includes(status)) {
        res.status(400).json({
          success: false,
          error: 'Status is required and must be either "Active" or "Suspended".',
        });
        return;
      }

      const updated = await merchantManagementService.updateStatus(
        id,
        status,
        officerName,
        reason
      );

      res.status(200).json({
        success: true,
        message: `Merchant status updated to "${status}".`,
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update merchant status',
      });
    }
  }
}

export const merchantManagementController = new MerchantManagementController();
