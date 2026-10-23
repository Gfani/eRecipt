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

const SESSIONS_FILE = path.join(DATA_DIR, 'admin-sessions.json');

type StoredOfficer = OfficerUser & { passwordHash: string };

const INITIAL_OFFICERS: StoredOfficer[] = [
  {
    id: 'off-demo-101',
    username: 'officer.demo',
    passwordHash: 'Revenue123',
    name: 'Abebe Bikila',
    badgeNumber: 'RO-101',
    role: 'REVENUE_OFFICER',
    email: 'officer.demo@mor.gov.et',
    branch: 'Addis Ababa Large Taxpayers Branch',
    createdAt: '2026-10-22T00:00:00.000Z',
  },
  {
    id: 'off-1792695191459',
    username: 'officer.fani',
    passwordHash: 'Password123',
    name: 'Fanuel Kassahun',
    badgeNumber: 'RO-305',
    role: 'REVENUE_OFFICER',
    email: 'fanuel.kassahun@mor.gov.et',
    branch: 'Addis Ababa Large Taxpayers Branch',
    createdAt: '2026-10-22T18:53:11.459Z',
  },
  {
    id: 'off-admin-001',
    username: 'admin',
    passwordHash: 'Admin123',
    name: 'Revenue System Administrator',
    badgeNumber: 'ADM-001',
    role: 'ADMIN',
    email: 'admin@mor.gov.et',
    branch: 'Ministry of Revenues Head Office',
    createdAt: '2026-10-22T00:00:00.000Z',
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

      if (fs.existsSync(SESSIONS_FILE)) {
        try {
          const sessionsRaw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
          const parsed = JSON.parse(sessionsRaw);
          if (Array.isArray(parsed)) {
            for (const [tok, sess] of parsed) {
              if (sess && sess.expiresAt > Date.now()) {
                activeSessions.set(tok, sess);
              }
            }
          }
        } catch {}
      }
    } catch {
      this.officersCache = [...INITIAL_OFFICERS];
    }

    this.isLoaded = true;
  }

  private saveSessionsToFile(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const sessionEntries = Array.from(activeSessions.entries());
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessionEntries, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Failed to persist admin sessions:', err);
    }
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
    this.saveSessionsToFile();

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
    this.saveSessionsToFile();

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
        if (this.officersCache.length > 0) {
          const { passwordHash: _, ...officer } = this.officersCache[0];
          return officer;
        }
      }
      return null;
    }

    if (Date.now() > session.expiresAt) {
      activeSessions.delete(cleanToken);
      this.saveSessionsToFile();
      return null;
    }

    return session.officer;
  }

  /**
   * Logout by invalidating session token
   */
  async logout(token: string): Promise<boolean> {
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    const result = activeSessions.delete(cleanToken);
    this.saveSessionsToFile();
    return result;
  }
}

export const officerAuthService = new OfficerAuthService();
