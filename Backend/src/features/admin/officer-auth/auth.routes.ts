import { Router } from 'express';
import { officerAuthController } from './auth.controller.js';

export const officerAuthRouter = Router();

officerAuthRouter.post('/login', (req, res) => officerAuthController.login(req, res));
officerAuthRouter.post('/verify-2fa', (req, res) => officerAuthController.verify2FA(req, res));
officerAuthRouter.post('/resend-2fa', (req, res) => officerAuthController.resend2FA(req, res));
officerAuthRouter.post('/register', (req, res) => officerAuthController.register(req, res));
officerAuthRouter.get('/me', (req, res) => officerAuthController.getMe(req, res));
officerAuthRouter.post('/logout', (req, res) => officerAuthController.logout(req, res));
