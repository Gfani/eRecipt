import { Router } from "express";
import { auditController } from "./audit.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { auditFilterSchema, approveTaxSchema } from "./audit.schema.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

export const auditRouter = Router();

// Protected: All audit routes require authentication
auditRouter.use(requireAuth);

auditRouter.get(
  "/monthly",
  auditController.getMonthlyRecords
);

auditRouter.post(
  "/calculate-tax",
  validateRequest({ body: auditFilterSchema }),
  auditController.calculateTax
);

auditRouter.post(
  "/approve",
  validateRequest({ body: approveTaxSchema }),
  auditController.approveTax
);

auditRouter.get(
  "/logs",
  auditController.getAuditLogs
);
