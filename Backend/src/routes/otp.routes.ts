import { Router, Request, Response } from 'express';
import { otpService } from '../services/otp.service.js';

export const otpRouter = Router();

/**
 * POST /api/otp/send
 * Request body: { email: string, purpose?: string, recipientName?: string }
 */
otpRouter.post('/send', async (req: Request, res: Response) => {
  try {
    const { email, purpose = 'auth', recipientName } = req.body;
    if (!email || !email.trim()) {
      res.status(400).json({ success: false, error: 'Email address is required.' });
      return;
    }

    const result = await otpService.sendOtp(email, purpose, recipientName);
    if (!result.success) {
      res.status(429).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to dispatch OTP.' });
  }
});

/**
 * POST /api/otp/verify
 * Request body: { email: string, code: string, purpose?: string }
 */
otpRouter.post('/verify', async (req: Request, res: Response) => {
  try {
    const { email, code, purpose = 'auth' } = req.body;
    if (!email || !email.trim() || !code || !code.trim()) {
      res.status(400).json({ success: false, error: 'Both email and 6-digit code are required.' });
      return;
    }

    const result = otpService.verifyOtp(email, code, purpose);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'OTP verification failed.' });
  }
});

/**
 * POST /api/otp/resend
 * Request body: { email: string, purpose?: string, recipientName?: string }
 */
otpRouter.post('/resend', async (req: Request, res: Response) => {
  try {
    const { email, purpose = 'auth', recipientName } = req.body;
    if (!email || !email.trim()) {
      res.status(400).json({ success: false, error: 'Email address is required.' });
      return;
    }

    const result = await otpService.sendOtp(email, purpose, recipientName);
    if (!result.success) {
      res.status(429).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to resend OTP.' });
  }
});
