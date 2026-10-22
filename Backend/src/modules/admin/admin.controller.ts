import { Request, Response, NextFunction } from "express";
import { adminService } from "./admin.service.js";
import { sendSuccess } from "../../common/apiResponse.js";

export class AdminController {
  async getOverviewStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await adminService.getOverviewStats();
      sendSuccess(res, stats, "Officer overview metrics retrieved");
    } catch (error) {
      next(error);
    }
  }

  async getTaxReports(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reports = await adminService.getTaxReports();
      sendSuccess(res, reports, "Tax reports ledger retrieved");
    } catch (error) {
      next(error);
    }
  }

  async getSalesRecords(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const records = await adminService.getSalesRecords();
      sendSuccess(res, records, "Sales records ledger retrieved");
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
