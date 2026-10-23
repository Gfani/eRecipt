export interface MerchantRegistrationFormData {
  // Step 1: Account details
  fullName: string;
  phoneNumber: string;
  email: string;
  emailVerified: boolean;
  password: string;

  // Step 2: Tax identity
  sellerLegalName: string;
  tradeName: string;
  tin: string;
  businessLicenseNumber: string;

  // Step 3: Licenses
  uploadedFileName: string;
  uploadedFileSize: string;
  isDocumentReady: boolean;
  documentFile?: File | null;

  // Step 4: Business location
  city: string;
  subCity: string;
  buildingName: string;
  floor: string;
  gpsLocation: string;

  // Step 5: Certification
  certified: boolean;
}

export interface MerchantUserProfile {
  fullName: string;
  phoneNumber: string;
  email?: string;
  sellerLegalName: string;
  tradeName: string;
  tin: string;
  businessLicenseNumber: string;
  uploadedFileName?: string;
  uploadedFileSize?: string;
  documentUrl?: string;
  city: string;
  subCity: string;
  buildingName: string;
  floor: string;
  gpsLocation?: string;
  referenceNumber: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  registeredAt: string;
}

export const initialRegistrationFormData: MerchantRegistrationFormData = {
  fullName: '',
  phoneNumber: '',
  email: '',
  emailVerified: false,
  password: '',
  sellerLegalName: '',
  tradeName: '',
  tin: '',
  businessLicenseNumber: '',
  uploadedFileName: '',
  uploadedFileSize: '',
  isDocumentReady: false,
  documentFile: null,
  city: '',
  subCity: '',
  buildingName: '',
  floor: '',
  gpsLocation: '',
  certified: false,
};

export type RegistrationStep = 1 | 2 | 3 | 4 | 5;
