import { UnauthorizedError } from "../../common/errors.js";
import { MerchantLoginInput, OfficerLoginInput } from "./auth.schema.js";
import { MerchantAuthResponse, OfficerAuthResponse } from "./auth.types.js";

export class AuthService {
  /**
   * Authenticate merchant by TIN and password
   */
  async loginMerchant(input: MerchantLoginInput): Promise<MerchantAuthResponse> {
    // In production, compare hashed password against database
    // For demo/prototype, accept valid 10-digit TIN
    if (input.password.length < 6) {
      throw new UnauthorizedError("Invalid credentials provided.");
    }

    return {
      token: `demo-token-merchant-${input.tin}`,
      user: {
        id: "mer-10482",
        role: "merchant",
        tin: input.tin,
        businessName: "Abeba Market PLC",
        tradeName: "Abeba Market",
        status: "Approved",
      },
    };
  }

  /**
   * Authenticate Revenue Officer by username and password
   */
  async loginOfficer(input: OfficerLoginInput): Promise<OfficerAuthResponse> {
    // Demo credentials matching frontend demo ("officer.demo" / "Revenue123")
    if (input.username !== "officer.demo" || input.password !== "Revenue123") {
      throw new UnauthorizedError("Invalid officer credentials. Check demo username and password.");
    }

    return {
      token: "demo-token-officer-auth-session",
      user: {
        id: "off-001",
        role: "officer",
        username: input.username,
        fullName: "Abebe Bikila",
        department: "Ministry of Revenues - Large Taxpayers Office",
      },
    };
  }
}

export const authService = new AuthService();
