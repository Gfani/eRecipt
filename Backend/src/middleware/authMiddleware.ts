import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../common/errors.js";

export type UserRole = "merchant" | "officer" | "admin";

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  identifier: string; // TIN for merchant, username for officer
  name: string;
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
 * Supports Bearer token / header-based authentication for dev & demo flexibility.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const devRoleHeader = req.headers["x-user-role"] as UserRole | undefined;
  const devIdHeader = req.headers["x-user-id"] as string | undefined;

  // Flexible authentication for prototype & API clients
  if (devRoleHeader) {
    req.user = {
      id: devIdHeader || "dev-user-1",
      role: devRoleHeader,
      identifier: devRoleHeader === "merchant" ? "0012847391" : "officer.demo",
      name: devRoleHeader === "merchant" ? "Abeba Market" : "Revenue Officer Demo",
    };
    return next();
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // For demo/development convenience, default to authenticated officer if in dev
    // but flag unauthorized if strictly checked
    throw new UnauthorizedError("Authentication token or credentials required.");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new UnauthorizedError("Invalid authorization format.");
  }

  // Simulated decoded token payload
  req.user = {
    id: "usr-1",
    role: token.includes("officer") ? "officer" : "merchant",
    identifier: token.includes("officer") ? "officer.demo" : "0012847391",
    name: token.includes("officer") ? "Officer Demo" : "Abeba Market",
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
