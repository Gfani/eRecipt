import { Request, Response, NextFunction } from "express";
import { receiptsService } from "./receipts.service.js";
import { sendCreated, sendSuccess } from "../../common/apiResponse.js";

export class ReceiptsController {
  async createReceipt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const receipt = await receiptsService.createReceipt(req.body);
      sendCreated(res, receipt, "Digital receipt generated and verified");
    } catch (error) {
      next(error);
    }
  }

  async getReceipts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { merchantId, status, search } = req.query;
      const receipts = await receiptsService.getReceipts({
        merchantId: merchantId as string | undefined,
        status: status as string | undefined,
        search: search as string | undefined,
      });
      sendSuccess(res, receipts, "Receipts retrieved");
    } catch (error) {
      next(error);
    }
  }

  async getReceiptById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const receipt = await receiptsService.getReceiptById(id);
      sendSuccess(res, receipt, "Receipt details retrieved");
    } catch (error) {
      next(error);
    }
  }

  async verifyReceipt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const receiptNumber = String(req.params.receiptNumber);
      const result = await receiptsService.verifyReceipt(receiptNumber);
      sendSuccess(res, result, "Receipt verified against official registry");
    } catch (error) {
      next(error);
    }
  }

  async voidReceipt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const voided = await receiptsService.voidReceipt(id, req.body);
      sendSuccess(res, voided, "Receipt has been marked as voided");
    } catch (error) {
      next(error);
    }
  }
}

export const receiptsController = new ReceiptsController();
