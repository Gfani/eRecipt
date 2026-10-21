export type MerchantTaxpayerStatus = 'active' | 'suspended' | 'under_audit';

export interface DirectoryMerchant {
  id: string;
  legalName: string;
  tradeName: string;
  tin: string;
  sector: 'Retail' | 'Hospitality' | 'Services' | 'Manufacturing' | 'Wholesale';
  taxCategory: 'VAT 15%' | 'TOT 2%' | 'Exempt';
  city: string;
  subCity: string;
  accreditationNo: string;
  registeredDate: string;
  status: MerchantTaxpayerStatus;
  contactPhone: string;
}
