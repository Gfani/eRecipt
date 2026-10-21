export interface MerchantRegistrationFormData {
  // Step 1: Account details
  fullName: string;
  phoneNumber: string;
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

  // Step 4: Business location
  city: string;
  subCity: string;
  buildingName: string;
  floor: string;
  gpsLocation: string;

  // Step 5: Certification
  certified: boolean;
}

export const initialRegistrationFormData: MerchantRegistrationFormData = {
  fullName: '',
  phoneNumber: '',
  password: '',
  sellerLegalName: 'Abeba Market PLC',
  tradeName: 'Abeba Market',
  tin: '0012345642',
  businessLicenseNumber: 'BL/AA/2026/00148',
  uploadedFileName: 'vat-certificate.pdf',
  uploadedFileSize: '1.4 MB · Ready for MoR validation',
  isDocumentReady: true,
  city: 'Addis Ababa',
  subCity: 'Bole',
  buildingName: 'Morning Star Mall',
  floor: '2nd floor',
  gpsLocation: '',
  certified: false,
};

export type RegistrationStep = 1 | 2 | 3 | 4 | 5;
