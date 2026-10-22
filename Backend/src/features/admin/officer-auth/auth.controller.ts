import type { Request, Response } from 'express';
import { officerAuthService } from './auth.service.js';

export class OfficerAuthController {
  /**
   * POST /api/admin/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, rememberMe } = req.body;

      if (!username || !password) {
        res.status(400).json({
          success: false,
          error: 'Username and password are required',
        });
        return;
      }

      const authResult = await officerAuthService.login({
        username,
        password,
        rememberMe: Boolean(rememberMe),
      });

      res.status(200).json({
        success: true,
        message: 'Revenue Officer authenticated successfully',
        data: authResult,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message || 'Authentication failed',
      });
    }
  }

  /**
   * GET /api/admin/auth/me
   */
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization || '';
      const officer = await officerAuthService.getOfficerFromToken(authHeader);

      if (!officer) {
        res.status(401).json({
          success: false,
          error: 'Invalid or expired officer session',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: officer,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to retrieve officer profile',
      });
    }
  }

  /**
   * POST /api/admin/auth/logout
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization || '';
      await officerAuthService.logout(authHeader);

      res.status(200).json({
        success: true,
        message: 'Signed out successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Logout failed',
      });
    }
  }
}

export const officerAuthController = new OfficerAuthController();
