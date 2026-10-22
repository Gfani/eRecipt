import { Router } from "express";
import { adminController } from "./admin.controller.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";

export const adminRouter = Router();

// Protected: All routes restricted to Revenue Officers & Admins
adminRouter.use(requireAuth);
adminRouter.use(requireRole("officer", "admin"));

adminRouter.get(
  "/overview",
  adminController.getOverviewStats
);

adminRouter.get(
  "/tax-reports",
  adminController.getTaxReports
);

adminRouter.get(
  "/sales-records",
  adminController.getSalesRecords
);
