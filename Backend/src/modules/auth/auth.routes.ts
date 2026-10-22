import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { merchantLoginSchema, officerLoginSchema } from "./auth.schema.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

export const authRouter = Router();

authRouter.post(
  "/merchant/login",
  validateRequest({ body: merchantLoginSchema }),
  authController.loginMerchant
);

authRouter.post(
  "/officer/login",
  validateRequest({ body: officerLoginSchema }),
  authController.loginOfficer
);

authRouter.get(
  "/me",
  requireAuth,
  authController.getCurrentUser
);
