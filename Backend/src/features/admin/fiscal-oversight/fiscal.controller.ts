import type { Request, Response } from 'express';
import { fiscalService } from './fiscal.service.js';
import type { DecisionPayload } from './types.js';

export class FiscalController {
  public getOverview = (_req: Request, res: Response): void => {
    try {
      const metrics = fiscalService.getOverviewMetrics();
      res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (err) {
      console.error('[FiscalController] getOverview error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve overview metrics',
      });
    }
  };

  public getReports = (req: Request, res: Response): void => {
    try {
      const { status, category, search } = req.query;
      const reports = fiscalService.getTaxReports({
        status: typeof status === 'string' ? status : undefined,
        category: typeof category === 'string' ? category : undefined,
        search: typeof search === 'string' ? search : undefined,
      });

      res.status(200).json({
        success: true,
        count: reports.length,
        data: reports,
      });
    } catch (err) {
      console.error('[FiscalController] getReports error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve tax reports',
      });
    }
  };

  public getReportByRef = (req: Request, res: Response): void => {
    try {
      const ref = Array.isArray(req.params.ref) ? req.params.ref[0] : req.params.ref;
      if (!ref) {
        res.status(400).json({ success: false, message: 'Report reference is required' });
        return;
      }
      const report = fiscalService.getTaxReportByRef(ref);

      if (!report) {
        res.status(404).json({
          success: false,
          message: `Tax report ${ref} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (err) {
      console.error('[FiscalController] getReportByRef error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve tax report details',
      });
    }
  };

  public handleReportDecision = (req: Request, res: Response): void => {
    try {
      const ref = Array.isArray(req.params.ref) ? req.params.ref[0] : req.params.ref;
      if (!ref) {
        res.status(400).json({ success: false, message: 'Report reference is required' });
        return;
      }
      const payload: DecisionPayload = req.body;

      if (!payload || !payload.kind) {
        res.status(400).json({
          success: false,
          message: 'Decision kind is required (approve | request | reject)',
        });
        return;
      }

      const result = fiscalService.processReportDecision(ref, payload);
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Decision '${payload.kind}' recorded successfully for ${ref}`,
        data: result.report,
      });
    } catch (err) {
      console.error('[FiscalController] handleReportDecision error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to record officer decision',
      });
    }
  };

  public getSalesRecords = (req: Request, res: Response): void => {
    try {
      const { tin } = req.query;
      const records = fiscalService.getSalesRecords({
        tin: typeof tin === 'string' ? tin : undefined,
      });

      res.status(200).json({
        success: true,
        count: records.length,
        data: records,
      });
    } catch (err) {
      console.error('[FiscalController] getSalesRecords error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve sales records',
      });
    }
  };

  public getTaxRecords = (_req: Request, res: Response): void => {
    try {
      const records = fiscalService.getTaxRecords();
      res.status(200).json({
        success: true,
        count: records.length,
        data: records,
      });
    } catch (err) {
      console.error('[FiscalController] getTaxRecords error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve tax records ledger',
      });
    }
  };

  public getAuditLogs = (_req: Request, res: Response): void => {
    try {
      const logs = fiscalService.getAuditLogs();
      res.status(200).json({
        success: true,
        count: logs.length,
        data: logs,
      });
    } catch (err) {
      console.error('[FiscalController] getAuditLogs error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve audit trail logs',
      });
    }
  };
}

export const fiscalController = new FiscalController();
