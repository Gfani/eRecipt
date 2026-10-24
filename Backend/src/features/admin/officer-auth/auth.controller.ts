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
        message: authResult.requires2FA
          ? 'Security code sent to your registered email.'
          : 'Revenue Officer authenticated successfully',
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
   * POST /api/admin/auth/verify-2fa
   */
  async verify2FA(req: Request, res: Response): Promise<void> {
    try {
      const { tempToken, code } = req.body;
      if (!tempToken || !code) {
        res.status(400).json({
          success: false,
          error: 'Verification session token and 6-digit code are required',
        });
        return;
      }

      const authResult = await officerAuthService.verify2FA({ tempToken, code });
      res.status(200).json({
        success: true,
        message: 'Two-factor authentication successful',
        data: authResult,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message || 'Invalid or expired verification code',
      });
    }
  }

  /**
   * POST /api/admin/auth/resend-2fa
   */
  async resend2FA(req: Request, res: Response): Promise<void> {
    try {
      const { tempToken } = req.body;
      if (!tempToken) {
        res.status(400).json({
          success: false,
          error: 'Verification session token is required to resend code',
        });
        return;
      }

      const resendResult = await officerAuthService.resend2FA(tempToken);
      if (!resendResult.success) {
        res.status(429).json(resendResult);
        return;
      }

      res.status(200).json(resendResult);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to resend verification code',
      });
    }
  }

  /**
   * POST /api/admin/auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, username, badgeNumber, email, branch, role, password } = req.body;

      if (!fullName || !username || !badgeNumber || !email || !password) {
        res.status(400).json({
          success: false,
          error: 'Full name, username, badge number, email, and password are required',
        });
        return;
      }

      const authResult = await officerAuthService.register({
        fullName,
        username,
        badgeNumber,
        email,
        branch,
        role,
        password,
      });

      res.status(201).json({
        success: true,
        message: 'Revenue Officer registered successfully',
        data: authResult,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Registration failed',
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

  /**
   * GET /api/admin/auth/officers
   */
  async listOfficers(_req: Request, res: Response): Promise<void> {
    try {
      const officers = officerAuthService.getAllOfficers();
      res.status(200).json({
        success: true,
        data: officers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to list officers',
      });
    }
  }

  /**
   * DELETE /api/admin/auth/officers/:id
   */
  async deleteOfficer(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const success = officerAuthService.deactivateOfficer(id);
      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Officer not found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Officer removed successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to deactivate officer',
      });
    }
  }
}

export const officerAuthController = new OfficerAuthController();
