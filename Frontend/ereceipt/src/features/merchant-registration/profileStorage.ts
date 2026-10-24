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
    // 1. Check if an authenticated merchant session exists
    const authRaw =
      window.localStorage.getItem('ereceipt_merchant') ||
      window.localStorage.getItem('merchant_user') ||
      window.sessionStorage.getItem('ereceipt_merchant');

    let authMerchant: any = null;
    if (authRaw) {
      try {
        authMerchant = JSON.parse(authRaw);
      } catch {
        // ignore JSON parse error
      }
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    let profile: MerchantUserProfile = raw ? JSON.parse(raw) : { ...DEFAULT_MERCHANT_PROFILE };

    // Clean up any historical mock demo data
    if (
      profile.fullName === 'Tigist Getachew' ||
      profile.sellerLegalName === 'Abeba Market PLC' ||
      profile.tradeName === 'Abeba Market'
    ) {
      profile = { ...DEFAULT_MERCHANT_PROFILE };
    }

    // 2. If an authenticated merchant is active, their identity is authoritative
    if (authMerchant && authMerchant.tin) {
      // If the stored profile in localStorage was from a different merchant, discard it to prevent cross-contamination
      if (profile.tin && profile.tin !== authMerchant.tin) {
        profile = { ...DEFAULT_MERCHANT_PROFILE };
      }
      profile.tin = authMerchant.tin;
      profile.sellerLegalName =
        authMerchant.businessName || profile.sellerLegalName || authMerchant.sellerLegalName || '';
      profile.tradeName =
        authMerchant.tradeName || profile.tradeName || authMerchant.businessName || '';
      if (!profile.fullName && authMerchant.fullName) {
        profile.fullName = authMerchant.fullName;
      }
      profile.status = authMerchant.status || profile.status || 'Approved';
    }

    return profile;
  } catch {
    return { ...DEFAULT_MERCHANT_PROFILE };
  }
}

export function saveStoredMerchantProfile(profile: MerchantUserProfile): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Dispatch custom events so all dependent components (Sidebar, Topbar, Ledger, Audit, Preview) re-render immediately
    window.dispatchEvent(new Event('ereceipt:profile_updated'));
    window.dispatchEvent(
      new CustomEvent('ereceipt:receipts_updated', { detail: { merchantTin: profile.tin } })
    );
  } catch (err) {
    console.error('Failed to save profile to localStorage:', err);
  }
}

export function clearStoredMerchantProfile(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem('ereceipt_merchant');
    window.localStorage.removeItem('merchant_user');
    window.localStorage.removeItem('ereceipt_token');
    window.localStorage.removeItem('merchant_token');
    window.sessionStorage.removeItem('ereceipt_token');
    window.sessionStorage.removeItem('ereceipt_merchant');
    window.dispatchEvent(new Event('ereceipt:profile_updated'));
    window.dispatchEvent(
      new CustomEvent('ereceipt:receipts_updated', { detail: { merchantTin: '' } })
    );
  } catch {
    // ignore
  }
}
