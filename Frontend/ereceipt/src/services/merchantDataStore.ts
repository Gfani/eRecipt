export interface ReceiptItem {
  id: number | string;
  code: string;
  name: string;
  price: number;
  qty: number;
  uom: string;
  discount: number;
  vatCategory: string;
  exciseRate: number;
  supplyType?: string;
}

export interface StoredReceipt {
  id: string;
  merchantTin: string;
  merchantName: string;
  merchantLegalName?: string;
  merchantTradeName?: string;
  merchantAddress?: string;
  cashierName?: string;
  operatorId?: string;
  branchCode?: string;
  documentType: string;
  transactionMode: string;
  customerName: string;
  customerTin?: string;
  customerVat?: string;
  customerNationalId?: string;
  customerPhone?: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  exciseTax: number;
  withholdingTax: number;
  total: number;
  paymentMethod: string;
  paymentReference?: string;
  receiptNumber: string;
  issuedAt: string;
  irn: string;
  rrn: string;
  digitalSignature: string;
  clearanceTimestamp: string;
  qrPayload?: string;
  qrVerificationUrl?: string;
  status: string;
}

export interface MonthlyLedgerRecord {
  id: string;
  month: string;
  year: number;
  monthKey: string; // YYYY-MM
  totalIncome: number;
  totalTax: number;
  expenses: number;
  invoicesCount: number;
  vatStandard: number;
  withholdingTax: number;
  receipts: StoredReceipt[];
}

export interface MonthlyAuditRecord {
  key: string;
  month: string;
  income: number;
  expenses: number;
  tax: number;
  invoicesCount: number;
}

const STORAGE_PREFIX = 'ereceipt_merchant_receipts_';

/**
 * Get all receipts issued by a specific merchant
 */
export function getMerchantReceipts(merchantTin: string): StoredReceipt[] {
  if (!merchantTin) return [];

  const key = `${STORAGE_PREFIX}${merchantTin}`;
  try {
    const raw = localStorage.getItem(key);
    let receipts: StoredReceipt[] = raw ? JSON.parse(raw) : [];

    // If empty and merchant is 0987654321, initialize with the 2 real user-issued receipts from DB
    if (receipts.length === 0 && merchantTin === '0987654321') {
      const initialRealReceipts: StoredReceipt[] = [
        {
          id: 'IRN-ET-2026-908427370',
          merchantTin: '0987654321',
          merchantName: 'Fani Market',
          merchantLegalName: 'Fani Market',
          merchantTradeName: 'Fani Market',
          merchantAddress: 'Bole, Woreda 03, House 114, Addis Ababa',
          cashierName: 'Cashier / Operator',
          operatorId: 'CASH-014 / REG01',
          branchCode: 'BOL01',
          documentType: 'Electronic Cash / Payment Receipt',
          transactionMode: 'B2C / Walk-in Customer',
          customerName: 'Walk-in Customer',
          customerTin: '0012345678',
          customerPhone: '0987654321',
          items: [
            { id: 1, code: 'HM-076', name: 'FFKK', price: 1100, qty: 1, uom: 'BOX', discount: 0, vatCategory: 'Standard VAT (15%)', exciseRate: 0, supplyType: 'Goods' },
            { id: 2, code: 'ST-018', name: 'JKLLN', price: 1800, qty: 2, uom: 'BOX', discount: 0, vatCategory: 'Standard VAT (15%)', exciseRate: 0, supplyType: 'Goods' },
          ],
          subtotal: 4700,
          exciseTax: 0,
          tax: 705,
          withholdingTax: 0,
          total: 5405,
          paymentMethod: 'Cash',
          receiptNumber: 'AM2081-REG01-2026-000196',
          issuedAt: '2026-10-23T09:34:45.222Z',
          irn: 'IRN-ET-2026-908427370',
          rrn: 'RRN-ET-2026-101472722',
          digitalSignature: 'SHA256:6034F1F8BB2A6060E189DF20194EIMS',
          clearanceTimestamp: '23 Oct 2026, 12:34:45 EAT',
          qrVerificationUrl: 'https://eims.mor.gov.et/verify/IRN-ET-2026-908427370',
          status: 'CLEARED',
        },
        {
          id: 'IRN-ET-2026-468092932',
          merchantTin: '0987654321',
          merchantName: 'Fani Market',
          merchantLegalName: 'Fani Market',
          merchantTradeName: 'Fani Market',
          merchantAddress: 'Bole, Woreda 03, House 114, Addis Ababa',
          cashierName: 'Cashier / Operator',
          operatorId: 'CASH-014 / REG01',
          branchCode: 'BOL01',
          documentType: 'Electronic Cash / Payment Receipt',
          transactionMode: 'B2C / Walk-in Customer',
          customerName: 'Walk-in Customer',
          customerPhone: '0987653421',
          items: [
            { id: 1, code: 'HM-076', name: 'T-shirts', price: 1500, qty: 1, uom: 'PCS', discount: 0, vatCategory: 'Standard VAT (15%)', exciseRate: 0, supplyType: 'Goods' },
            { id: 2, code: 'ST-018', name: 'Pants', price: 1800, qty: 2, uom: 'PCS', discount: 0, vatCategory: 'Standard VAT (15%)', exciseRate: 0, supplyType: 'Goods' },
          ],
          subtotal: 5100,
          exciseTax: 0,
          tax: 765,
          withholdingTax: 0,
          total: 5865,
          paymentMethod: 'Cash',
          receiptNumber: 'AM2081-REG01-2026-000195',
          issuedAt: '2026-10-23T09:06:08.034Z',
          irn: 'IRN-ET-2026-468092932',
          rrn: 'RRN-ET-2026-527171354',
          digitalSignature: 'SHA256:919B368700A5357AF8829402195EIMS',
          clearanceTimestamp: '23 Oct 2026, 12:06:08 EAT',
          qrVerificationUrl: 'https://eims.mor.gov.et/verify/IRN-ET-2026-468092932',
          status: 'CLEARED',
        },
      ];
      localStorage.setItem(key, JSON.stringify(initialRealReceipts));
      receipts = initialRealReceipts;
    }

    return receipts;
  } catch {
    return [];
  }
}

/**
 * Save a new receipt exclusively for a specific merchant
 */
export function saveMerchantReceipt(merchantTin: string, receipt: StoredReceipt): void {
  if (!merchantTin) return;

  const key = `${STORAGE_PREFIX}${merchantTin}`;
  try {
    const receipts = getMerchantReceipts(merchantTin);
    // Prepend new receipt
    const updated = [receipt, ...receipts.filter((r) => r.id !== receipt.id)];
    localStorage.setItem(key, JSON.stringify(updated));

    // Dispatch global event so all screens re-compute immediately
    window.dispatchEvent(new CustomEvent('ereceipt:receipts_updated', { detail: { merchantTin } }));
  } catch (err) {
    console.error('Error saving merchant receipt:', err);
  }
}

/**
 * Get the latest cleared receipt for the merchant
 */
export function getLatestMerchantReceipt(merchantTin: string): StoredReceipt | null {
  const receipts = getMerchantReceipts(merchantTin);
  return receipts.length > 0 ? receipts[0] : null;
}

/**
 * Compute monthly transaction ledger solely from the merchant's real receipts
 */
export function getMerchantMonthlyLedger(merchantTin: string, filterYear?: number): MonthlyLedgerRecord[] {
  const receipts = getMerchantReceipts(merchantTin);
  const groups = new Map<string, MonthlyLedgerRecord>();

  for (const receipt of receipts) {
    if (!receipt.issuedAt) continue;
    const dateObj = new Date(receipt.issuedAt);
    const year = dateObj.getFullYear();
    if (filterYear && year !== filterYear) continue;

    const monthKey = receipt.issuedAt.slice(0, 7); // e.g. "2026-10"
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });

    let record = groups.get(monthKey);
    if (!record) {
      record = {
        id: `rec-${monthKey}`,
        month: monthName,
        year,
        monthKey,
        totalIncome: 0,
        totalTax: 0,
        expenses: 0,
        invoicesCount: 0,
        vatStandard: 0,
        withholdingTax: 0,
        receipts: [],
      };
      groups.set(monthKey, record);
    }

    record.totalIncome += receipt.total || 0;
    record.totalTax += (receipt.tax || 0) + (receipt.exciseTax || 0);
    record.vatStandard += receipt.tax || 0;
    record.withholdingTax += receipt.withholdingTax || 0;
    record.invoicesCount += 1;
    record.receipts.push(receipt);
  }

  // Sort descending by monthKey
  return Array.from(groups.values()).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
}

/**
 * Compute monthly audit records strictly from merchant's real receipts within date range
 */
export function getMerchantAuditRecords(merchantTin: string, startDate: string, endDate: string): MonthlyAuditRecord[] {
  const receipts = getMerchantReceipts(merchantTin);
  const startKey = startDate.slice(0, 7);
  const endKey = endDate.slice(0, 7);

  const groups = new Map<string, MonthlyAuditRecord>();

  for (const receipt of receipts) {
    if (!receipt.issuedAt) continue;
    const monthKey = receipt.issuedAt.slice(0, 7);
    if (monthKey < startKey || monthKey > endKey) continue;

    const dateObj = new Date(receipt.issuedAt);
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    let record = groups.get(monthKey);
    if (!record) {
      record = {
        key: monthKey,
        month: monthName,
        income: 0,
        expenses: 0,
        tax: 0,
        invoicesCount: 0,
      };
      groups.set(monthKey, record);
    }

    record.income += receipt.total || 0;
    record.tax += (receipt.tax || 0) + (receipt.exciseTax || 0);
    record.invoicesCount += 1;
  }

  // Sort descending
  return Array.from(groups.values()).sort((a, b) => b.key.localeCompare(a.key));
}
