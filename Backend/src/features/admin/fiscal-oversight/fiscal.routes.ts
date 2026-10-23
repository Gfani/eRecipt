import { Router } from 'express';
import { fiscalController } from './fiscal.controller.js';

export const fiscalOversightRouter = Router();

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
