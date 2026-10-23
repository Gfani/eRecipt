import type { Request, Response } from 'express';
import { sendSuccess, sendError } from '../common/apiResponse.js';

export interface BusinessProfile {
  legalName: string;
  tradeName: string;
  tin: string;
  merchantRef: string;
  businessEmail: string;
  phoneNumber: string;
  businessAddress: string;
  isTinVerified: boolean;
}

export interface UpdateProfileDTO {
  businessEmail?: string;
  phoneNumber?: string;
  businessAddress?: string;
  legalName?: string;
  tradeName?: string;
  tin?: string;
  merchantRef?: string;
}

// In-memory profile state matching the frontend BusinessProfileTab specification
let profile: BusinessProfile = {
  legalName: 'Abebe Trading PLC',
  tradeName: 'Abebe Supermarket',
  tin: '001•••••42',
  merchantRef: 'AM-2081',
  businessEmail: 'info@abebetrading.et',
  phoneNumber: '+251911234567',
  businessAddress: 'Bole Subcity, Woreda 03, House 412, Addis Ababa, Ethiopia',
  isTinVerified: true,
};

/**
 * GET /api/settings/profile
 * Retrieves the current business profile.
 */
export const getProfile = (_req: Request, res: Response): void => {
  sendSuccess(res, { ...profile }, 'Business profile retrieved successfully');
};

/**
 * PATCH /api/settings/profile
 * Updates the business profile fields with strict security validation.
 */
export const updateProfile = (req: Request, res: Response): void => {
  const body = (req.body ?? {}) as UpdateProfileDTO;

  // Strict Security Guard: TIN and Merchant Reference are verified and immutable
  if (
    (body.tin !== undefined && body.tin !== profile.tin) ||
    (body.merchantRef !== undefined && body.merchantRef !== profile.merchantRef)
  ) {
    sendError(res, 'TIN and Merchant Reference are verified and immutable', 400);
    return;
  }

  // Validate email format with basic regex
  if (body.businessEmail !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof body.businessEmail !== 'string' || !emailRegex.test(body.businessEmail.trim())) {
      sendError(res, 'Invalid business email format', 400);
      return;
    }
  }

  // Validate phone presence
  if (body.phoneNumber !== undefined) {
    if (typeof body.phoneNumber !== 'string' || body.phoneNumber.trim().length === 0) {
      sendError(res, 'Phone number is required and cannot be empty', 400);
      return;
    }
  }

  // Validate business address
  if (body.businessAddress !== undefined) {
    if (typeof body.businessAddress !== 'string' || body.businessAddress.trim().length === 0) {
      sendError(res, 'Business address is required and cannot be empty', 400);
      return;
    }
  }

  // Apply updates
  if (body.businessEmail !== undefined) {
    profile.businessEmail = body.businessEmail.trim();
  }
  if (body.phoneNumber !== undefined) {
    profile.phoneNumber = body.phoneNumber.trim();
  }
  if (body.businessAddress !== undefined) {
    profile.businessAddress = body.businessAddress.trim();
  }
  if (body.legalName !== undefined && typeof body.legalName === 'string' && body.legalName.trim().length > 0) {
    profile.legalName = body.legalName.trim();
  }
  if (body.tradeName !== undefined && typeof body.tradeName === 'string' && body.tradeName.trim().length > 0) {
    profile.tradeName = body.tradeName.trim();
  }

  sendSuccess(res, { ...profile }, 'Business profile updated successfully');
};

export const settingsController = {
  getProfile,
  updateProfile,
};

export class SettingsController {
  public static getProfile = getProfile;
  public static updateProfile = updateProfile;
}

export default settingsController;
