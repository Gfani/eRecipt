import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  TaxReportItem,
  AuditEventItem,
  SalesRecordItem,
  TaxRecordItem,
  OverviewMetrics,
} from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../../../../data/admin-fiscal-data.json');

interface FiscalStorageSchema {
  reports: TaxReportItem[];
  auditEvents: AuditEventItem[];
  salesRecords: SalesRecordItem[];
  taxRecords: TaxRecordItem[];
}

export class FiscalStorage {
  private cache: FiscalStorageSchema | null = null;

  private load(): FiscalStorageSchema {
    if (this.cache) return this.cache;

    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.cache = JSON.parse(raw);
        return this.cache!;
      }
    } catch (err) {
      console.error('[FiscalStorage] Error loading data:', err);
    }

    this.cache = {
      reports: [],
      auditEvents: [],
      salesRecords: [],
      taxRecords: [],
    };
    return this.cache;
  }

  private save(): void {
    if (!this.cache) return;
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.cache, null, 2), 'utf-8');
    } catch (err) {
      console.error('[FiscalStorage] Error writing data:', err);
    }
  }

  public getReports(filters?: { status?: string; category?: string; search?: string }): TaxReportItem[] {
    const data = this.load();
    let result = [...data.reports];

    if (filters?.status) {
      const statusLower = filters.status.toLowerCase();
      result = result.filter((r) => r.status.toLowerCase() === statusLower);
    }

    if (filters?.category) {
      const catLower = filters.category.toLowerCase();
      result = result.filter((r) => r.category.toLowerCase() === catLower);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.tin.includes(q) ||
          r.ref.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getReportByRef(ref: string): TaxReportItem | undefined {
    const data = this.load();
    return data.reports.find((r) => r.ref.toLowerCase() === ref.toLowerCase());
  }

  public updateReportStatus(
    ref: string,
    status: TaxReportItem['status'],
    notes?: string
  ): TaxReportItem | null {
    const data = this.load();
    const idx = data.reports.findIndex((r) => r.ref.toLowerCase() === ref.toLowerCase());
    if (idx === -1) return null;

    data.reports[idx].status = status;
    if (notes) {
      data.reports[idx].notes = notes;
    }
    this.save();
    return data.reports[idx];
  }

  public getAuditEvents(): AuditEventItem[] {
    const data = this.load();
    return [...data.auditEvents];
  }

  public addAuditEvent(event: AuditEventItem): void {
    const data = this.load();
    data.auditEvents.unshift(event);
    this.save();
  }

  public getSalesRecords(filters?: { tin?: string }): SalesRecordItem[] {
    const data = this.load();
    let records = [...data.salesRecords];

    if (filters?.tin) {
      records = records.filter((r) => r.tin === filters.tin);
    }

    return records;
  }

  public getTaxRecords(): TaxRecordItem[] {
    const data = this.load();
    return [...data.taxRecords];
  }

  public getOverviewMetrics(): OverviewMetrics {
    const data = this.load();

    const clearedTaxSum = data.taxRecords
      .filter((t) => t.status === 'Cleared')
      .reduce((acc, curr) => acc + curr.amountCleared, 0);

    const pendingCount = data.reports.filter(
      (r) => r.status === 'Pending' || r.status === 'Additional Information Required'
    ).length;

    const approvedCount = data.reports.filter((r) => r.status === 'Approved').length;
    const totalReports = data.reports.length;
    const rate = totalReports > 0 ? Math.round((approvedCount / totalReports) * 100) : 94;

    const formattedTax =
      clearedTaxSum > 1000000
        ? `${(clearedTaxSum / 1000000).toFixed(2)}M ETB`
        : `${clearedTaxSum.toLocaleString()} ETB`;

    return {
      totalTaxCollected: formattedTax,
      activeMerchants: 1420,
      pendingFilings: pendingCount,
      complianceRate: `${rate}%`,
      eimsUptime: '99.98%',
      monthlyTargetProgress: 78.4,
    };
  }
}

export const fiscalStorage = new FiscalStorage();
