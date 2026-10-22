export type ReceiptStatus = "Issued" | "Cleared" | "Voided";
export type PaymentMethod = "Cash" | "Telebirr" | "CBEBirr" | "Card" | "Bank Transfer";

export interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Receipt {
  id: string;
  receiptNumber: string; // e.g. RC-2026-0048
  merchantId: string;
  merchantName: string;
  merchantTin: string;
  merchantAddress: string;
  customerName?: string;
  customerTin?: string;
  customerPhone?: string;
  items: ReceiptItem[];
  subtotal: number;
  taxRate: number; // 0.15
  taxAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: ReceiptStatus;
  voidReason?: string;
  verificationUrl: string;
  qrPayload: string;
  createdAt: string;
  voidedAt?: string;
}
