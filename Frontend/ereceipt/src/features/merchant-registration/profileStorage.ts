import type { MerchantUserProfile } from './types';

const STORAGE_KEY = 'ereceipt:merchant_profile';

export const DEFAULT_MERCHANT_PROFILE: MerchantUserProfile = {
  fullName: 'Tigist Getachew',
  phoneNumber: '+251 91 123 4567',
  sellerLegalName: 'Abeba Market PLC',
  tradeName: 'Abeba Market',
  tin: '0012847391',
  businessLicenseNumber: 'BL-AA-2024-9102',
  uploadedFileName: 'abeba_market_trade_license.pdf',
  uploadedFileSize: '2.1 MB',
  city: 'Addis Ababa',
  subCity: 'Bole',
  buildingName: 'Medhanealem Mall',
  floor: 'Ground Floor, Shop 12',
  gpsLocation: '8.9951, 38.7892',
  referenceNumber: 'APP-2026-0148',
  status: 'Approved',
  registeredAt: new Date().toISOString(),
};

export function getStoredMerchantProfile(): MerchantUserProfile {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_MERCHANT_PROFILE;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MERCHANT_PROFILE;
  }
}

export function saveStoredMerchantProfile(profile: MerchantUserProfile): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Dispatch a custom storage event so other components (Sidebar, Topbar) re-render immediately
    window.dispatchEvent(new Event('ereceipt:profile_updated'));
  } catch (err) {
    console.error('Failed to save profile to localStorage:', err);
  }
}

export function clearStoredMerchantProfile(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('ereceipt:profile_updated'));
  } catch {
    // ignore
  }
}
