import type { Request, Response } from 'express';
import { TinVerificationService } from '../services/tinVerificationService.js';

export class TinController {
  /**
   * POST /api/tin/verify
   * Body: { tin: string }
   */
  public static async verify(req: Request, res: Response): Promise<void> {
    try {
      const tin = req.body?.tin || req.query?.tin;

      if (!tin || typeof tin !== 'string') {
        res.status(400).json({ valid: false, message: 'TIN parameter is required.' });
        return;
      }

      const result = TinVerificationService.verifyTin(tin);

      if (!result.valid) {
        res.status(400).json(result);
        return;
      }

      res.json(result);
    } catch (err) {
      console.error('Error verifying TIN:', err);
      res.status(500).json({ valid: false, message: 'Internal error during TIN verification.' });
    }
  }

  /**
   * GET /api/tin/:tin
   */
  public static async getByTin(req: Request, res: Response): Promise<void> {
    try {
      const tin = Array.isArray(req.params.tin) ? req.params.tin[0] : req.params.tin;
      const result = TinVerificationService.verifyTin(tin);
      res.json(result);
    } catch (err) {
      console.error('Error getting TIN:', err);
      res.status(500).json({ valid: false, message: 'Internal error during TIN check.' });
    }
  }
}
