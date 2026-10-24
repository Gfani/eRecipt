import type { Request, Response } from 'express';
import crypto from 'node:crypto';
import { sendSuccess } from '../common/apiResponse.js';

export interface InvoicePartySeller {
  legalName: string;
  tradeName: string;
  tin: string;
  vatRegNo: string;
  address: string;
  phone: string;
}

export interface InvoicePartyBuyer {
  legalName: string;
  tin: string;
  vatRegNo: string;
  address: string;
}

export interface ClearedInvoiceItem {
  id: number;
  code: string;
  name: string;
  qty: number;
  uom: string;
  price: number;
  discount: number;
  vatCategory: string;
  totalTaxable: number;
  vatAmount: number;
  lineTotal: number;
}

export interface ClearedInvoiceDocument {
  invoiceNumber: string;
  irn: string;
  rrn: string;
  fiscalDeviceNo: string;
  issueDateGregorian: string;
  issueDateEthiopian: string;
  seller: InvoicePartySeller;
  buyer: InvoicePartyBuyer;
  items: ClearedInvoiceItem[];
  subtotal: number;
  vatTotal: number;
  grandTotal: number;
  totalInWords: string;
  clearanceStatus: string;
  clearedAt: string;
}

export interface QrPayload {
  irn: string;
  verificationUrl: string;
  digitalSignatureHash: string;
  timestamp: string;
}

/**
 * GET /api/invoices/:id/clearance-preview
 * Retrieves the full clearance document data structure matching ClearedInvoiceDocument.
 */
export const getClearancePreview = (req: Request, res: Response): void => {
  const rawId = req.params.id;
  const invoiceId = Array.isArray(rawId) ? rawId[0] : rawId;
  const invoiceNumber = (typeof invoiceId === 'string' && invoiceId.startsWith('INV-'))
    ? invoiceId
    : 'INV-2026-00412';

  const clearanceData: ClearedInvoiceDocument = {
    invoiceNumber,
    irn: 'ET-EIMS-2026-9812401',
    rrn: 'TXN-8842109',
    fiscalDeviceNo: 'FD-AASTU-01',
    issueDateGregorian: new Date().toISOString().split('T')[0],
    issueDateEthiopian: 'Tikimt 13, 2019 E.C.',
    seller: {
      legalName: 'Abebe Trading PLC',
      tradeName: 'Abebe Supermarket',
      tin: '0012345642',
      vatRegNo: 'VAT-884192',
      address: 'Bole Subcity, Woreda 03, Addis Ababa, Ethiopia',
      phone: '+251911234567',
    },
    buyer: {
      legalName: 'Ethio Telecom Corporation',
      tin: '0003412589',
      vatRegNo: 'VAT-102948',
      address: 'Churchill Road, Addis Ababa, Ethiopia',
    },
    items: [
      {
        id: 1,
        code: 'PRD-001',
        name: 'Dell Precision 5570 Laptop',
        qty: 2,
        uom: 'PCS',
        price: 85000,
        discount: 0,
        vatCategory: 'Standard VAT (15%)',
        totalTaxable: 170000,
        vatAmount: 25500,
        lineTotal: 195500,
      },
    ],
    subtotal: 170000,
    vatTotal: 25500,
    grandTotal: 195500,
    totalInWords: 'One Hundred Ninety-Five Thousand Five Hundred Ethiopian Birr',
    clearanceStatus: 'CLEARED_BY_MOR',
    clearedAt: new Date().toISOString(),
  };

  sendSuccess(res, clearanceData, 'Invoice clearance preview retrieved');
};

/**
 * GET /api/invoices/:id/qr-payload
 * Generates canonical MoR verification link and SHA-256 digital signature hash.
 */
export const getQrPayload = (req: Request, res: Response): void => {
  const _invoiceId = req.params.id;

  const irn = 'ET-EIMS-2026-9812401';
  const grandTotal = 195500;
  const sellerTin = '0012345642';
  const buyerTin = '0003412589';

  const verificationUrl = `https://eims.mor.gov.et/verify?irn=${irn}`;
  const rawSignaturePayload = `${irn}|${grandTotal}|${sellerTin}|${buyerTin}`;
  const digitalSignatureHash = crypto
    .createHash('sha256')
    .update(rawSignaturePayload)
    .digest('hex');

  const qrPayload: QrPayload = {
    irn,
    verificationUrl,
    digitalSignatureHash,
    timestamp: new Date().toISOString(),
  };

  sendSuccess(res, qrPayload, 'QR payload generated successfully');
};

export const taxInvoicePreviewController = {
  getClearancePreview,
  getQrPayload,
};

export class TaxInvoicePreviewController {
  public static getClearancePreview = getClearancePreview;
  public static getQrPayload = getQrPayload;
}

export default taxInvoicePreviewController;
