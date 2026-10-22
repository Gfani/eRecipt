import crypto from 'node:crypto';
import type { OfficerUser, OfficerLoginRequest, OfficerAuthResponse } from './auth.types.js';

// Pre-seeded revenue administration officers
const REVENUE_OFFICERS: Array<OfficerUser & { passwordHash: string }> = [
  {
    id: 'off-001',
    username: 'officer.demo',
    passwordHash: 'Revenue123', // In demo prototype, matching against accepted revenue password
    name: 'Hana Alemu',
    badgeNumber: 'RO-218',
    role: 'REVENUE_OFFICER',
    email: 'hana.alemu@mor.gov.et',
    branch: 'Addis Ababa Large Taxpayers Branch',
    createdAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 'off-002',
    username: 'auditor.demo',
    passwordHash: 'Revenue123',
    name: 'Bekele Tadesse',
    badgeNumber: 'RO-184',
    role: 'SENIOR_AUDITOR',
    email: 'bekele.tadesse@mor.gov.et',
    branch: 'Central Tax Enforcement Division',
    createdAt: '2023-06-10T08:00:00.000Z',
  },
  {
    id: 'off-003',
    username: 'admin.demo',
    passwordHash: 'Revenue123',
    name: 'Meron Girma',
    badgeNumber: 'RO-203',
    role: 'ADMIN',
    email: 'meron.girma@mor.gov.et',
    branch: 'Ministry of Revenues HQ',
    createdAt: '2023-01-01T08:00:00.000Z',
  },
];

// Active sessions map: token -> OfficerUser & expiresAt
interface Session {
  officer: OfficerUser;
  expiresAt: number;
}

const activeSessions = new Map<string, Session>();

export class OfficerAuthService {
  /**
   * Authenticate officer with username and password
   */
  async login(credentials: OfficerLoginRequest): Promise<OfficerAuthResponse> {
    const trimmedUsername = credentials.username.trim().toLowerCase();
    const officerMatch = REVENUE_OFFICERS.find(
      (o) => o.username.toLowerCase() === trimmedUsername
    );

    if (!officerMatch) {
      throw new Error('Invalid officer username or password.');
    }

    if (credentials.password !== officerMatch.passwordHash) {
      throw new Error('Invalid officer username or password.');
    }

    // Generate secure random token
    const token = `ro_tok_${crypto.randomBytes(32).toString('hex')}`;
    const durationMs = credentials.rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const expiresAt = Date.now() + durationMs;

    // Sanitize officer object (exclude password)
    const { passwordHash: _, ...officer } = officerMatch;

    activeSessions.set(token, { officer, expiresAt });

    return {
      token,
      expiresIn: credentials.rememberMe ? '7d' : '24h',
      officer,
    };
  }

  /**
   * Validate session token and return officer details
   */
  async getOfficerFromToken(token: string): Promise<OfficerUser | null> {
    if (!token) return null;

    // Format clean token
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    const session = activeSessions.get(cleanToken);

    if (!session) {
      // In development prototype mode, if token is "mock-demo-token", return Hana Alemu
      if (cleanToken === 'demo-token' || cleanToken === 'mock-demo-token') {
        const { passwordHash: _, ...officer } = REVENUE_OFFICERS[0];
        return officer;
      }
      return null;
    }

    if (Date.now() > session.expiresAt) {
      activeSessions.delete(cleanToken);
      return null;
    }

    return session.officer;
  }

  /**
   * Logout by invalidating session token
   */
  async logout(token: string): Promise<boolean> {
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    return activeSessions.delete(cleanToken);
  }
}

export const officerAuthService = new OfficerAuthService();
