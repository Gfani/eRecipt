import type { MerchantUserProfile } from './types';

const STORAGE_KEY = 'ereceipt:merchant_profile';

export const DEFAULT_MERCHANT_PROFILE: MerchantUserProfile = {
  fullName: '',
  phoneNumber: '',
  sellerLegalName: '',
  tradeName: '',
  tin: '',
  businessLicenseNumber: '',
  uploadedFileName: '',
  uploadedFileSize: '',
  city: '',
  subCity: '',
  buildingName: '',
  floor: '',
  gpsLocation: '',
  referenceNumber: '',
  status: 'Pending',
  registeredAt: '',
};

export function getStoredMerchantProfile(): MerchantUserProfile {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_MERCHANT_PROFILE;
    const parsed = JSON.parse(raw);
    // If user's stored profile contains old mock demo data, reset to clean default
    if (parsed.fullName === 'Tigist Getachew' || parsed.sellerLegalName === 'Abeba Market PLC') {
      window.localStorage.removeItem(STORAGE_KEY);
      return DEFAULT_MERCHANT_PROFILE;
    }
    return parsed;
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
