import { UnauthorizedError, ForbiddenError } from "../../common/errors.js";
import { MerchantLoginInput, OfficerLoginInput } from "./auth.schema.js";
import { MerchantAuthResponse, OfficerAuthResponse } from "./auth.types.js";
import { applicationStorage } from "../../features/merchant-registration/storage.js";
import { verifyPassword, signJwt } from "../../common/auth/security.js";

export class AuthService {
  /**
   * Authenticate merchant by TIN and password against registered applications
   */
  async loginMerchant(input: MerchantLoginInput): Promise<MerchantAuthResponse> {
    const tin = (input.tin || "").trim();

    if (tin.length !== 10) {
      throw new UnauthorizedError("Valid 10-digit Ethiopian TIN is required.");
    }

    if (!input.password || input.password.length < 6) {
      throw new UnauthorizedError("Password must be at least 6 characters.");
    }

    // 1. Look up merchant application by TIN
    const app = applicationStorage.getByTin(tin);

    if (!app) {
      // Demo / seed fallback for testing default TIN if applications file is pristine
      if (tin === "0012847391" && input.password === "Password123") {
        const token = signJwt({
          sub: "mer-10482",
          role: "merchant",
          identifier: tin,
          name: "Abeba Market PLC",
          tin,
          tradeName: "Abeba Market",
          status: "Approved",
        });
        return {
          token,
          user: {
            id: "mer-10482",
            role: "merchant",
            tin,
            businessName: "Abeba Market PLC",
            tradeName: "Abeba Market",
            status: "Approved",
          },
        };
      }
      throw new UnauthorizedError(`No merchant registered with TIN ${tin}. Please complete registration first.`);
    }

    // 2. Enforce approval status checks
    if (app.status === "Pending") {
      throw new ForbiddenError(
        `Application ${app.referenceNumber} is PENDING approval by the Ministry of Revenues. Please wait for an officer review.`
      );
    }
    if (app.status === "Under Review") {
      throw new ForbiddenError(
        `Application ${app.referenceNumber} is currently UNDER REVIEW by the Ministry of Revenues.`
      );
    }
    if (app.status === "Additional Information Required") {
      throw new ForbiddenError(
        `Application ${app.referenceNumber} requires additional information: ${app.reviewNotes || "Please contact MoR."}`
      );
    }
    if (app.status === "Rejected") {
      throw new ForbiddenError(
        `Application ${app.referenceNumber} was REJECTED: ${app.reviewNotes || "Please submit a new application."}`
      );
    }
    if (app.status !== "Approved") {
      throw new ForbiddenError(`Merchant account is not active (Current status: ${app.status}).`);
    }

    // 3. Verify password hash using constant-time comparison
    const isPasswordValid = verifyPassword(input.password, app.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials. The password provided does not match this TIN.");
    }

    // 4. Issue genuine signed JWT
    const token = signJwt({
      sub: app.id,
      role: "merchant",
      identifier: app.tin,
      name: app.sellerLegalName,
      tin: app.tin,
      tradeName: app.tradeName,
      status: app.status,
    });

    return {
      token,
      user: {
        id: app.id,
        role: "merchant",
        tin: app.tin,
        businessName: app.sellerLegalName,
        tradeName: app.tradeName,
        status: app.status,
      },
    };
  }

  /**
   * Authenticate Revenue Officer by username and password
   */
  async loginOfficer(input: OfficerLoginInput): Promise<OfficerAuthResponse> {
    const username = (input.username || "").trim().toLowerCase();
    if (username === "officer.demo" && input.password === "Revenue123") {
      const token = signJwt({
        sub: "off-001",
        role: "officer",
        identifier: "officer.demo",
        name: "Abebe Bikila",
        username: "officer.demo",
      });

      return {
        token,
        user: {
          id: "off-001",
          role: "officer",
          username: "officer.demo",
          fullName: "Abebe Bikila",
          department: "Ministry of Revenues - Large Taxpayers Office",
        },
      };
    }

    throw new UnauthorizedError("Invalid officer credentials. Check demo username and password.");
  }
}

export const authService = new AuthService();
