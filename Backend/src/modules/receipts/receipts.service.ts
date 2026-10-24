import { NotFoundError, BadRequestError } from "../../common/errors.js";
import { calculateReceiptTaxes } from "../../common/calculator.js";
import { CreateReceiptInput, VoidReceiptInput } from "./receipts.schema.js";
import { Receipt } from "./receipts.types.js";

export class ReceiptsService {
  private receipts: Receipt[] = [];

  /**
   * Issue a new digital receipt with automated tax calculation
   */
  async createReceipt(input: CreateReceiptInput): Promise<Receipt> {
    const taxCalc = calculateReceiptTaxes(input.items);
    const receiptNum = `RC-2026-00${this.receipts.length + 50}`;
    const id = `rc-${Date.now()}`;

    const itemsWithIds = taxCalc.items.map((item, idx) => ({
      id: `item-${Date.now()}-${idx + 1}`,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    }));

    const verificationUrl = `https://ereceipt.et/verify/${receiptNum}`;
    const qrPayload = `ERECEIPT|${receiptNum}|TIN:${input.merchantTin}|TOTAL:${taxCalc.totalAmount.toFixed(
      2
    )}|TAX:${taxCalc.taxAmount.toFixed(2)}|STATUS:CLEARED`;

    const receipt: Receipt = {
      id,
      receiptNumber: receiptNum,
      merchantId: input.merchantId || `MER-${Date.now()}`,
      merchantName: input.merchantName || "Registered Merchant",
      merchantTin: input.merchantTin || "",
      merchantAddress: input.merchantAddress || "Addis Ababa, Ethiopia",
      customerName: input.customerName || "Walk-in Customer",
      customerTin: input.customerTin,
      customerNationalId: input.customerNationalId,
      customerPhone: input.customerPhone,
      items: itemsWithIds,
      subtotal: taxCalc.subtotal,
      taxRate: taxCalc.taxRate,
      taxAmount: taxCalc.taxAmount,
      totalAmount: taxCalc.totalAmount,
      paymentMethod: input.paymentMethod || "Cash",
      status: "Cleared",
      verificationUrl,
      qrPayload,
      createdAt: new Date().toISOString(),
    };

    this.receipts.unshift(receipt);
    return receipt;
  }

  /**
   * List receipts with optional filters
   */
  async getReceipts(filters?: {
    merchantId?: string;
    merchantTin?: string;
    status?: string;
    search?: string;
  }): Promise<Receipt[]> {
    return this.receipts.filter((rc) => {
      if (filters?.merchantId && rc.merchantId !== filters.merchantId) return false;
      if (filters?.merchantTin && rc.merchantTin !== filters.merchantTin) return false;
      if (filters?.status && filters.status !== "All" && rc.status !== filters.status) return false;
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const matches =
          rc.receiptNumber.toLowerCase().includes(q) ||
          rc.merchantName.toLowerCase().includes(q) ||
          rc.merchantTin.includes(q) ||
          (rc.customerName && rc.customerName.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }

  /**
   * Retrieve single receipt by ID or Receipt Number
   */
  async getReceiptById(identifier: string): Promise<Receipt> {
    const rc = this.receipts.find(
      (r) => r.id === identifier || r.receiptNumber.toLowerCase() === identifier.toLowerCase()
    );
    if (!rc) {
      throw new NotFoundError(`Receipt '${identifier}' not found.`);
    }
    return rc;
  }

  /**
   * Public verification endpoint for QR code scans
   */
  async verifyReceipt(receiptNumber: string): Promise<{
    isValid: boolean;
    receipt: Receipt;
    verificationTimestamp: string;
  }> {
    const rc = await this.getReceiptById(receiptNumber);
    return {
      isValid: rc.status !== "Voided",
      receipt: rc,
      verificationTimestamp: new Date().toISOString(),
    };
  }

  /**
   * Void a receipt (e.g., in case of cancellation/refund)
   */
  async voidReceipt(id: string, input: VoidReceiptInput): Promise<Receipt> {
    const rc = await this.getReceiptById(id);
    if (rc.status === "Voided") {
      throw new BadRequestError("This receipt is already voided.");
    }

    rc.status = "Voided";
    rc.voidReason = input.reason;
    rc.voidedAt = new Date().toISOString();
    rc.qrPayload = `ERECEIPT|${rc.receiptNumber}|STATUS:VOIDED`;

    return rc;
  }
}

export const receiptsService = new ReceiptsService();
