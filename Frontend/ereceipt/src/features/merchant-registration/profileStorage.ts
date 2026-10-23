import type { MerchantUserProfile } from './types';

const STORAGE_KEY = 'ereceipt:merchant_profile';

export const DEFAULT_MERCHANT_PROFILE: MerchantUserProfile = {
  fullName: 'Tigist Getachew',
  phoneNumber: '+251 91 123 4567',
  sellerLegalName: 'Abeba Market PLC',
  tradeName: 'Abeba Market',
  tin: '0012345678',
  businessLicenseNumber: 'BL-ADDIS-2026-9812',
  uploadedFileName: '',
  uploadedFileSize: '',
  city: 'Addis Ababa',
  subCity: 'Bole',
  buildingName: 'Abeba Commercial Center',
  floor: '1st Floor',
  gpsLocation: '9.0123, 38.7636',
  referenceNumber: 'REF-ET-2026-0891',
  status: 'Approved',
  registeredAt: '2026-01-15',
};

export function getStoredMerchantProfile(): MerchantUserProfile {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_MERCHANT_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_MERCHANT_PROFILE, ...parsed };
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
