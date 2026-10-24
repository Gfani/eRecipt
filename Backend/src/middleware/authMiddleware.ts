import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../common/errors.js";
import { verifyJwt } from "../common/auth/security.js";

export type UserRole = "merchant" | "officer" | "admin";

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  identifier: string; // TIN for merchant, username for officer
  name: string;
  tin?: string;
  tradeName?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Authentication check middleware.
 * Strictly verifies cryptographic Bearer JWT tokens.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authentication token is required. Format: Bearer <token>");
  }

  const token = authHeader.split(" ")[1]?.trim();
  if (!token) {
    throw new UnauthorizedError("Invalid authorization format.");
  }

  const payload = verifyJwt(token);

  req.user = {
    id: payload.sub,
    role: payload.role as UserRole,
    identifier: payload.identifier || payload.tin || payload.username || payload.sub,
    name: payload.name,
    tin: payload.tin,
    tradeName: payload.tradeName,
  };

  next();
}

/**
 * Role-based authorization guard
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError("User is not authenticated.");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Access denied. Requires one of the following roles: ${allowedRoles.join(", ")}`
      );
    }

    next();
  };
}
