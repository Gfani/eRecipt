export type MerchantStatus =
  | "Pending"
  | "Under Review"
  | "Additional Information Required"
  | "Approved"
  | "Rejected";

export interface MerchantApplication {
  id: string;
  ref: string; // e.g., APP-2026-0148
  merchantId: string; // e.g., MER-10482
  fullName: string;
  phoneNumber: string;
  sellerLegalName: string;
  tradeName: string;
  tin: string;
  businessLicenseNumber: string;
  category: string;
  uploadedFileName?: string;
  uploadedFileSize?: string;
  isDocumentReady: boolean;
  city: string;
  subCity: string;
  buildingName?: string;
  floor?: string;
  gpsLocation?: string;
  certified: boolean;
  status: MerchantStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantProfile {
  id: string;
  merchantId: string;
  tin: string;
  sellerLegalName: string;
  tradeName: string;
  phoneNumber: string;
  category: string;
  city: string;
  subCity: string;
  status: MerchantStatus;
}
