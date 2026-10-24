import { Router } from 'express';
import { officerAuthController } from './auth.controller.js';
import { requireAuth, requireRole } from '../../../middleware/authMiddleware.js';

export const officerAuthRouter = Router();

officerAuthRouter.post('/login', (req, res) => officerAuthController.login(req, res));
officerAuthRouter.post('/verify-2fa', (req, res) => officerAuthController.verify2FA(req, res));
officerAuthRouter.post('/resend-2fa', (req, res) => officerAuthController.resend2FA(req, res));

// Officer registration route for onboarding Ministry officers
officerAuthRouter.post('/register', (req, res) =>
  officerAuthController.register(req, res)
);
officerAuthRouter.get('/check-availability', (req, res) =>
  officerAuthController.checkAvailability(req, res)
);

officerAuthRouter.get('/me', requireAuth, (req, res) => officerAuthController.getMe(req, res));
officerAuthRouter.post('/logout', (req, res) => officerAuthController.logout(req, res));
