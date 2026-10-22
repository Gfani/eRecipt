import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import type {
  OfficerUser,
  OfficerLoginRequest,
  OfficerAuthResponse,
  OfficerRegisterRequest,
} from './auth.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../../../data');
const OFFICERS_FILE = path.join(DATA_DIR, 'admin-officers.json');
const AUDIT_FILE = path.join(DATA_DIR, 'admin-audit-log.json');

type StoredOfficer = OfficerUser & { passwordHash: string };

// Pre-seeded revenue administration officers
const INITIAL_OFFICERS: StoredOfficer[] = [
  {
    id: 'off-001',
    username: 'officer.demo',
    passwordHash: 'Revenue123',
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
  private officersCache: StoredOfficer[] = [];
  private isLoaded = false;

  private ensureLoaded(): void {
    if (this.isLoaded) return;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(OFFICERS_FILE)) {
        const raw = fs.readFileSync(OFFICERS_FILE, 'utf-8');
        this.officersCache = JSON.parse(raw);
      } else {
        this.officersCache = [...INITIAL_OFFICERS];
        this.saveToFile();
      }
    } catch {
      this.officersCache = [...INITIAL_OFFICERS];
    }

    this.isLoaded = true;
  }

  private saveToFile(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(OFFICERS_FILE, JSON.stringify(this.officersCache, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist officers to disk:', err);
    }
  }

  /**
   * Record audit log entry for officer actions
   */
  private logAudit(entry: {
    officer: string;
    action: string;
    reference: string;
    statusTransition: string;
    notes: string;
  }): void {
    try {
      const timestamp = new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const fullEvent = {
        id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp,
        ...entry,
      };

      let events: any[] = [];
      if (fs.existsSync(AUDIT_FILE)) {
        try {
          events = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
        } catch {
          events = [];
        }
      }

      events.unshift(fullEvent);
      fs.writeFileSync(AUDIT_FILE, JSON.stringify(events, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Failed to record audit event in officer-auth:', err);
    }
  }

  /**
   * Authenticate officer with username and password
   */
  async login(credentials: OfficerLoginRequest): Promise<OfficerAuthResponse> {
    this.ensureLoaded();
    const trimmedUsername = credentials.username.trim().toLowerCase();
    const officerMatch = this.officersCache.find(
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

    const { passwordHash: _, ...officer } = officerMatch;
    activeSessions.set(token, { officer, expiresAt });

    return {
      token,
      expiresIn: credentials.rememberMe ? '7d' : '24h',
      officer,
    };
  }

  /**
   * Register a new revenue officer / admin
   */
  async register(payload: OfficerRegisterRequest): Promise<OfficerAuthResponse> {
    this.ensureLoaded();

    if (!payload.fullName?.trim()) {
      throw new Error('Full name is required.');
    }
    if (!payload.username?.trim()) {
      throw new Error('Officer username is required.');
    }
    if (!payload.badgeNumber?.trim()) {
      throw new Error('Officer badge or employee ID is required.');
    }
    if (!payload.email?.trim()) {
      throw new Error('Official email is required.');
    }
    if (!payload.password || payload.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const cleanUsername = payload.username.trim().toLowerCase();
    const existing = this.officersCache.find(
      (o) => o.username.toLowerCase() === cleanUsername
    );

    if (existing) {
      throw new Error(`Officer username "${payload.username}" is already taken.`);
    }

    const newOfficer: StoredOfficer = {
      id: `off-${Date.now()}`,
      username: payload.username.trim(),
      passwordHash: payload.password,
      name: payload.fullName.trim(),
      badgeNumber: payload.badgeNumber.trim().toUpperCase(),
      role: payload.role || 'REVENUE_OFFICER',
      email: payload.email.trim().toLowerCase(),
      branch: payload.branch?.trim() || 'Addis Ababa Large Taxpayers Branch',
      createdAt: new Date().toISOString(),
    };

    this.officersCache.push(newOfficer);
    this.saveToFile();

    // Log administrative onboarding event
    this.logAudit({
      officer: `${newOfficer.name} · ${newOfficer.badgeNumber}`,
      action: 'Officer credential registered',
      reference: newOfficer.badgeNumber,
      statusTransition: 'Unregistered → Active Officer',
      notes: `New officer onboarded: ${newOfficer.name} (${newOfficer.role}) at ${newOfficer.branch}`,
    });

    // Auto-login newly registered officer
    const token = `ro_tok_${crypto.randomBytes(32).toString('hex')}`;
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    const { passwordHash: _, ...officer } = newOfficer;
    activeSessions.set(token, { officer, expiresAt });

    return {
      token,
      expiresIn: '24h',
      officer,
    };
  }

  /**
   * Validate session token and return officer details
   */
  async getOfficerFromToken(token: string): Promise<OfficerUser | null> {
    if (!token) return null;

    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    const session = activeSessions.get(cleanToken);

    if (!session) {
      this.ensureLoaded();
      if (cleanToken === 'demo-token' || cleanToken === 'mock-demo-token') {
        const { passwordHash: _, ...officer } = this.officersCache[0] || INITIAL_OFFICERS[0];
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
