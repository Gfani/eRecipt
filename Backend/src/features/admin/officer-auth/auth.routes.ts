import { Router } from 'express';
import { officerAuthController } from './auth.controller.js';
import { requireAuth } from '../../../middleware/authMiddleware.js';

export const officerAuthRouter = Router();

officerAuthRouter.post('/login', (req, res) => officerAuthController.login(req, res));
officerAuthRouter.post('/verify-2fa', (req, res) => officerAuthController.verify2FA(req, res));
officerAuthRouter.post('/resend-2fa', (req, res) => officerAuthController.resend2FA(req, res));

// Officer onboarding / self-registration from portal
officerAuthRouter.post('/register', (req, res) =>
  officerAuthController.register(req, res)
);

// Manage officers
officerAuthRouter.get('/officers', (req, res) =>
  officerAuthController.listOfficers(req, res)
);
officerAuthRouter.delete('/officers/:id', (req, res) =>
  officerAuthController.deleteOfficer(req, res)
);

officerAuthRouter.get('/me', requireAuth, (req, res) => officerAuthController.getMe(req, res));
officerAuthRouter.post('/logout', (req, res) => officerAuthController.logout(req, res));
