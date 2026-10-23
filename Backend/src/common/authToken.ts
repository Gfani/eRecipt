import { createHmac, timingSafeEqual } from 'node:crypto';
import { UnauthorizedError } from './errors.js';
import { config } from '../config/index.js';
import type { AuthenticatedUser, UserRole } from '../middleware/authMiddleware.js';

interface AuthTokenClaims extends AuthenticatedUser {
  iat: number;
  exp: number;
}

const TOKEN_HEADER = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 8;

function sign(value: string): Buffer {
  return createHmac('sha256', config.jwtSecret).update(value).digest();
}

export function createAuthToken(
  user: AuthenticatedUser,
  expiresInSeconds = DEFAULT_EXPIRY_SECONDS
): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const claims: AuthTokenClaims = {
    ...user,
    iat: issuedAt,
    exp: issuedAt + expiresInSeconds,
  };
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signingInput = `${TOKEN_HEADER}.${payload}`;
  return `${signingInput}.${sign(signingInput).toString('base64url')}`;
}

function isUserRole(value: unknown): value is UserRole {
  return value === 'merchant' || value === 'officer' || value === 'admin';
}

export function verifyAuthToken(token: string): AuthenticatedUser {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new UnauthorizedError('Invalid or expired authentication token.');
  }

  const [header, payload, signature] = parts;
  if (header !== TOKEN_HEADER) {
    throw new UnauthorizedError('Invalid or expired authentication token.');
  }

  const signingInput = `${header}.${payload}`;
  const suppliedSignature = Buffer.from(signature, 'base64url');
  const expectedSignature = sign(signingInput);

  if (
    suppliedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(suppliedSignature, expectedSignature)
  ) {
    throw new UnauthorizedError('Invalid or expired authentication token.');
  }

  let claims: Partial<AuthTokenClaims>;
  try {
    claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Partial<AuthTokenClaims>;
  } catch {
    throw new UnauthorizedError('Invalid or expired authentication token.');
  }

  if (
    typeof claims.id !== 'string' ||
    !isUserRole(claims.role) ||
    typeof claims.identifier !== 'string' ||
    typeof claims.name !== 'string' ||
    typeof claims.exp !== 'number' ||
    claims.exp <= Math.floor(Date.now() / 1000)
  ) {
    throw new UnauthorizedError('Invalid or expired authentication token.');
  }

  return {
    id: claims.id,
    role: claims.role,
    identifier: claims.identifier,
    name: claims.name,
  };
}
