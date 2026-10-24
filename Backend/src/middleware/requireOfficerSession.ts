import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../common/errors.js';
import { officerAuthService } from '../features/admin/officer-auth/index.js';
import { verifyJwt } from '../common/auth/security.js';

export async function requireOfficerSession(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization || '';
    const officer = await officerAuthService.getOfficerFromToken(authHeader);
    if (officer) {
      req.user = {
        id: officer.id,
        role: officer.role === 'ADMIN' ? 'admin' : 'officer',
        identifier: officer.username,
        name: officer.name,
      };
      return next();
    }

    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      try {
        const payload = verifyJwt(token);
        if (payload.role === 'officer' || payload.role === 'admin') {
          req.user = {
            id: payload.sub,
            role: payload.role,
            identifier: payload.identifier || payload.username || payload.sub,
            name: payload.name,
          };
          return next();
        }
      } catch {
        // Fall through to error
      }
    }

    throw new UnauthorizedError('A valid revenue officer session is required.');
  } catch (error) {
    next(error);
  }
}
