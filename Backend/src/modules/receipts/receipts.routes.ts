import { Router } from "express";
import { receiptsController } from "./receipts.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createReceiptSchema, voidReceiptSchema } from "./receipts.schema.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

export const receiptsRouter = Router();

// Public verification route for customers scanning QR code on a paper/digital receipt
receiptsRouter.get(
  "/verify/:receiptNumber",
  receiptsController.verifyReceipt
);

// Protected routes for merchants & officers
receiptsRouter.post(
  "/",
  requireAuth,
  validateRequest({ body: createReceiptSchema }),
  receiptsController.createReceipt
);

receiptsRouter.get(
  "/",
  requireAuth,
  receiptsController.getReceipts
);

receiptsRouter.get(
  "/:id",
  requireAuth,
  receiptsController.getReceiptById
);

receiptsRouter.post(
  "/:id/void",
  requireAuth,
  validateRequest({ body: voidReceiptSchema }),
  receiptsController.voidReceipt
);
