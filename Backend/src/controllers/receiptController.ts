import type { Request, Response } from 'express';
import { ReceiptService } from '../services/receiptService.js';
import { calculateTaxes } from '../services/taxCalculationService.js';
import type { ReceiptDraft } from '../models/types.js';
import { applicationStorage } from '../features/merchant-registration/storage.js';
import { ForbiddenError } from '../common/errors.js';
import { ReceiptImageService } from '../services/receiptImageService.js';

export class ReceiptController {
  /**
   * POST /api/receipts/issue
   */
  public static async issue(req: Request, res: Response): Promise<void> {
    try {
      let merchantTin = req.user?.identifier || req.body.merchantTin || '0011223344';
      let merchantName = req.body.merchantName || req.body.merchantLegalName || 'Registered Merchant';
      let merchantAddress = req.body.merchantAddress || 'Addis Ababa, Ethiopia';

      if (req.user?.role === 'merchant') {
        const merchant = applicationStorage.getByTin(req.user.identifier);
        if (merchant) {
          merchantTin = merchant.tin;
          merchantName = merchant.sellerLegalName || merchant.tradeName || merchantName;
          merchantAddress =
            [merchant.buildingName, merchant.subCity, merchant.city].filter(Boolean).join(', ') ||
            merchantAddress;
        }
      }

      const draft = {
        ...req.body,
        merchantId: req.body.merchantId || `MER-${merchantTin.slice(-5)}`,
        merchantTin,
        merchantName,
        merchantAddress,
      } as ReceiptDraft;

      if (!draft) {
        res.status(400).json({ error: 'Receipt payload is required in body.' });
        return;
      }

      const result = ReceiptService.issueReceipt(draft);

      if (!result.success) {
        res.status(422).json({
          success: false,
          error: 'Validation failed according to statutory EIMS rules.',
          details: result.errors,
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'MoR EIMS Clearance confirmed (HTTP 200). Receipt issued.',
        receipt: result.receipt,
      });
    } catch (err) {
      console.error('Error issuing receipt:', err);
      res.status(500).json({ error: 'Internal server error while processing fiscal receipt.' });
    }
  }

  /**
   * POST /api/receipts/calculate
   */
  public static async calculate(req: Request, res: Response): Promise<void> {
    try {
      const { items, transactionMode, withholdingRequested, isDesignatedAgent } = req.body;

      if (!Array.isArray(items)) {
        res.status(400).json({ error: 'items must be an array.' });
        return;
      }

      const results = calculateTaxes(
        items,
        transactionMode || 'B2B / Registered Buyer',
        Boolean(withholdingRequested),
        Boolean(isDesignatedAgent)
      );

      res.json({ success: true, calculations: results });
    } catch (err) {
      console.error('Error calculating taxes:', err);
      res.status(500).json({ error: 'Internal server error during tax calculation.' });
    }
  }

  /**
   * GET /api/receipts
   */
  public static async list(req: Request, res: Response): Promise<void> {
    try {
      const { search, documentType, limit, offset } = req.query;

      const merchantTin = req.user?.role === 'merchant'
        ? req.user.identifier
        : (req.query.merchantTin as string | undefined);

      if (!merchantTin && req.user?.role !== 'officer' && req.user?.role !== 'admin') {
        res.json({
          success: true,
          total: 0,
          receipts: [],
        });
        return;
      }

      const result = ReceiptService.getReceipts({
        search: typeof search === 'string' ? search : undefined,
        documentType: typeof documentType === 'string' ? documentType : undefined,
        merchantTin,
        limit: limit ? parseInt(limit as string, 10) : 50,
        offset: offset ? parseInt(offset as string, 10) : 0,
      });

      res.json({
        success: true,
        total: result.total,
        receipts: result.receipts,
      });
    } catch (err) {
      console.error('Error listing receipts:', err);
      res.status(500).json({ error: 'Internal server error while fetching receipts.' });
    }
  }

  /**
   * GET /api/receipts/:id
   */
  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const receipt = ReceiptService.getReceiptById(id);

      if (!receipt) {
        res.status(404).json({ error: `Receipt with ID/IRN "${id}" not found.` });
        return;
      }
      if (
        req.user?.role === 'merchant' &&
        receipt.merchantTin !== req.user.identifier
      ) {
        res.status(403).json({ error: 'Merchants may only access their own receipts.' });
        return;
      }

      res.json({ success: true, receipt });
    } catch (err) {
      console.error('Error fetching receipt:', err);
      res.status(500).json({ error: 'Internal server error while fetching receipt.' });
    }
  }

  /**
   * GET /api/receipts/verify/:irn
   */
  public static async verify(req: Request, res: Response): Promise<void> {
    try {
      const irn = Array.isArray(req.params.irn) ? req.params.irn[0] : req.params.irn;
      const receipt = ReceiptService.getReceiptByIrn(irn);

      if (!receipt) {
        res.status(404).json({
          valid: false,
          message: `No fiscal receipt found for IRN "${irn}".`,
        });
        return;
      }

      res.json({
        valid: true,
        receipt,
        irn: receipt.irn,
        receiptNumber: receipt.receiptNumber,
        issuedAt: receipt.issuedAt,
        clearanceTimestamp: receipt.clearanceTimestamp,
        merchantName: receipt.merchantName || (receipt as any).merchantLegalName,
        merchantTin: receipt.merchantTin,
        merchantAddress: receipt.merchantAddress,
        customerName: receipt.customerName,
        customerTin: receipt.customerTin,
        customerNationalId: receipt.customerNationalId,
        items: receipt.items,
        subtotal: receipt.subtotal,
        exciseTax: receipt.exciseTax,
        tax: receipt.tax,
        withholdingTax: receipt.withholdingTax,
        total: receipt.total,
        paymentMethod: receipt.paymentMethod,
        digitalSignature: receipt.digitalSignature,
        status: receipt.status,
      });
    } catch (err) {
      console.error('Error verifying receipt:', err);
      res.status(500).json({ error: 'Internal server error while verifying receipt.' });
    }
  }

  /**
   * GET /api/receipts/:irn/image
   * Serves receipt rendered directly as a vector SVG image
   */
  public static async getImage(req: Request, res: Response): Promise<void> {
    try {
      const rawParam = Array.isArray(req.params.irn) ? req.params.irn[0] : req.params.irn;
      const cleanIrn = decodeURIComponent(rawParam || '').trim();

      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', `inline; filename="receipt-${cleanIrn || 'eims'}.svg"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'public, max-age=3600');

      if (!cleanIrn) {
        res.status(400).send(ReceiptImageService.generateNotFoundSvg('INVALID_IDENTIFIER'));
        return;
      }

      // 1. Lookup by IRN, 2. Lookup by ID, 3. Lookup by receiptNumber in database
      let receipt = ReceiptService.getReceiptByIrn(cleanIrn) || ReceiptService.getReceiptById(cleanIrn);
      if (!receipt) {
        const list = ReceiptService.getReceipts({ search: cleanIrn, limit: 1 });
        if (list.receipts.length > 0) {
          receipt = list.receipts[0];
        }
      }

      if (!receipt) {
        const notFoundSvg = ReceiptImageService.generateNotFoundSvg(cleanIrn);
        res.status(404).send(notFoundSvg);
        return;
      }

      const theme = req.query.theme === 'thermal' ? 'thermal' : 'official';
      const lang = req.query.lang === 'am' ? 'am' : 'en';

      const svg = ReceiptImageService.generateReceiptSvg(receipt, {
        theme,
        language: lang,
      });

      res.status(200).send(svg);
    } catch (err) {
      console.error('Error generating receipt image:', err);
      res.status(500).setHeader('Content-Type', 'image/svg+xml').send(ReceiptImageService.generateNotFoundSvg('ERROR'));
    }
  }
}
