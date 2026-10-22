import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StoredMerchantApplication } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../../data');
const DATA_FILE = path.join(DATA_DIR, 'merchant-applications.json');

const INITIAL_APPLICATIONS: StoredMerchantApplication[] = [
  {
    id: 'app-001',
    referenceNumber: 'APP-2026-0148',
    submissionDate: '18 Oct 2026',
    status: 'Pending',
    fullName: 'Meklit Tadesse',
    phoneNumber: '+251 91 148 2901',
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sellerLegalName: 'Meklit Home Goods PLC',
    tradeName: 'Meklit Home Goods',
    tin: '0012847391',
    businessLicenseNumber: 'BL-AA-2024-9102',
    uploadedFileName: 'meklit_trade_license.pdf',
    uploadedFileSize: '2.4 MB',
    city: 'Addis Ababa',
    subCity: 'Lideta',
    buildingName: 'Sunshine Commercial Center',
    floor: '2nd Floor, Room 204',
    gpsLocation: '9.0123, 38.7421',
    certified: true,
    createdAt: new Date('2026-10-18T09:30:00Z').toISOString(),
    updatedAt: new Date('2026-10-18T09:30:00Z').toISOString(),
  },
  {
    id: 'app-002',
    referenceNumber: 'APP-2026-0147',
    submissionDate: '17 Oct 2026',
    status: 'Under Review',
    fullName: 'Dr. Desta Hailu',
    phoneNumber: '+251 92 841 0023',
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sellerLegalName: 'Desta Pharmacy Sole Proprietorship',
    tradeName: 'Desta Pharmacy',
    tin: '0049102847',
    businessLicenseNumber: 'BL-AA-2023-4412',
    uploadedFileName: 'desta_pharmacy_permit.pdf',
    uploadedFileSize: '1.8 MB',
    city: 'Addis Ababa',
    subCity: 'Bole',
    buildingName: 'Medhanealem Plaza',
    floor: 'Ground Floor, Unit G-03',
    gpsLocation: '8.9951, 38.7892',
    certified: true,
    createdAt: new Date('2026-10-17T11:15:00Z').toISOString(),
    updatedAt: new Date('2026-10-17T11:15:00Z').toISOString(),
  },
];

class MerchantApplicationStorage {
  private cache: StoredMerchantApplication[] = [];
  private isLoaded = false;

  private ensureLoaded(): void {
    if (this.isLoaded) return;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.cache = JSON.parse(raw);
      } else {
        this.cache = [...INITIAL_APPLICATIONS];
        this.saveToFile();
      }
    } catch {
      this.cache = [...INITIAL_APPLICATIONS];
    }

    this.isLoaded = true;
  }

  private saveToFile(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.cache, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist applications to disk:', err);
    }
  }

  public getAll(): StoredMerchantApplication[] {
    this.ensureLoaded();
    return [...this.cache];
  }

  public getByReference(referenceNumber: string): StoredMerchantApplication | undefined {
    this.ensureLoaded();
    const cleanRef = referenceNumber.trim().toUpperCase();
    return this.cache.find((item) => item.referenceNumber.toUpperCase() === cleanRef);
  }

  public getByTin(tin: string): StoredMerchantApplication | undefined {
    this.ensureLoaded();
    const cleanTin = tin.trim();
    return this.cache.find((item) => item.tin === cleanTin);
  }

  public getByPhone(phoneNumber: string): StoredMerchantApplication | undefined {
    this.ensureLoaded();
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    return this.cache.find((item) => item.phoneNumber.replace(/\s+/g, '') === cleanPhone);
  }

  public create(app: StoredMerchantApplication): StoredMerchantApplication {
    this.ensureLoaded();
    this.cache.unshift(app);
    this.saveToFile();
    return app;
  }

  public updateStatus(
    referenceNumber: string,
    status: StoredMerchantApplication['status'],
    reviewedBy?: string,
    reviewNotes?: string
  ): StoredMerchantApplication | null {
    this.ensureLoaded();
    const app = this.getByReference(referenceNumber);
    if (!app) return null;

    app.status = status;
    if (reviewedBy) app.reviewedBy = reviewedBy;
    if (reviewNotes) app.reviewNotes = reviewNotes;
    app.reviewedAt = new Date().toISOString();
    app.updatedAt = new Date().toISOString();

    this.saveToFile();
    return app;
  }
}

export const applicationStorage = new MerchantApplicationStorage();
