import { Router } from 'express';
import { fiscalController } from './fiscal.controller.js';
import { requireAuth, requireRole } from '../../../middleware/authMiddleware.js';

export const fiscalOversightRouter = Router();

// Protect all fiscal oversight routes
fiscalOversightRouter.use(requireAuth, requireRole('officer', 'admin'));

// Executive revenue metrics
fiscalOversightRouter.get('/overview', fiscalController.getOverview);

// Tax reports review pipeline
fiscalOversightRouter.get('/reports', fiscalController.getReports);
fiscalOversightRouter.get('/reports/:ref', fiscalController.getReportByRef);
fiscalOversightRouter.post('/reports/:ref/decision', fiscalController.handleReportDecision);

// National fiscal ledgers
fiscalOversightRouter.get('/sales-records', fiscalController.getSalesRecords);
fiscalOversightRouter.get('/tax-records', fiscalController.getTaxRecords);

// Central audit trail
fiscalOversightRouter.get('/audit-logs', fiscalController.getAuditLogs);
