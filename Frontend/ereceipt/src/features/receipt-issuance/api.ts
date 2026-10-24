import type { ReceiptDraft, IssuedReceipt, CartItem } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

export interface BackendHealthResponse {
  status: string;
  service: string;
  version: string;
  mode: string;
  merchantCode: string;
  branchCode: string;
  registerCode: string;
  timestamp: string;
}

export interface TinVerifyResult {
  valid: boolean;
  tin: string;
  message: string;
  taxpayer?: {
    tin: string;
    tradeName: string;
    vatNumber: string;
    registrationStatus: string;
    designatedWithholdingAgent: boolean;
    taxCenter: string;
    verifiedAt: string;
  };
}

/**
 * Check if the eReceipt MoR EIMS Backend is online
 */
export async function checkBackendHealth(): Promise<BackendHealthResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Verify a 10-digit Ethiopian TIN with the backend registry
 */
export async function verifyTinApi(tin: string): Promise<TinVerifyResult> {
  const res = await fetch(`${API_BASE_URL}/tin/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tin }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `TIN verification failed (HTTP ${res.status})`);
  }

  return await res.json();
}

/**
 * Submit draft receipt to Backend for official MoR EIMS fiscal clearance with idempotency
 */
export async function issueReceiptApi(
  draft: ReceiptDraft,
  idempotencyKey?: string
): Promise<IssuedReceipt> {
  const token =
    localStorage.getItem('merchant_token') ||
    localStorage.getItem('ereceipt_token') ||
    sessionStorage.getItem('ereceipt_token');

  const key =
    idempotencyKey ||
    (draft as any).idempotencyKey ||
    `idem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const res = await fetch(`${API_BASE_URL}/receipts/issue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': key,
      'X-Idempotency-Key': key,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ ...draft, idempotencyKey: key }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData.details?.join(' ') ||
      errorData.error ||
      `Fiscal clearance failed (HTTP ${res.status})`;
    throw new Error(message);
  }

  const data = await res.json();
  return data.receipt;
}

/**
 * Fetch latest products catalog from backend
 */
export async function fetchProductsApi(): Promise<CartItem[]> {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data.products;
}
