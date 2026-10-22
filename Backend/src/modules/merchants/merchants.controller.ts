import { Request, Response, NextFunction } from "express";
import { merchantsService } from "./merchants.service.js";
import { sendCreated, sendSuccess } from "../../common/apiResponse.js";

export class MerchantsController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const application = await merchantsService.register(req.body);
      sendCreated(
        res,
        application,
        "Merchant application submitted successfully. Reference generated."
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, category, search } = req.query;
      const applications = await merchantsService.getAllApplications({
        status: status as string | undefined,
        category: category as string | undefined,
        search: search as string | undefined,
      });
      sendSuccess(res, applications, "Merchant applications retrieved");
    } catch (error) {
      next(error);
    }
  }

  async getApplicationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const application = await merchantsService.getByRefOrId(id);
      sendSuccess(res, application, "Application details retrieved");
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const updated = await merchantsService.updateStatus(id, req.body);
      sendSuccess(res, updated, `Merchant status updated to ${updated.status}`);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const profile = await merchantsService.getProfile(id);
      sendSuccess(res, profile, "Merchant profile retrieved");
    } catch (error) {
      next(error);
    }
  }
}

export const merchantsController = new MerchantsController();
