export type AdminPage =
  | 'overview'
  | 'approvals'
  | 'merchantReview'
  | 'directory'
  | 'merchantDetails'
  | 'sales'
  | 'reports'
  | 'reportReview'
  | 'taxRecords'
  | 'audit'
  | 'settings';

export type DecisionKind = 'approve' | 'request' | 'reject';
export type DecisionEntity = 'merchant' | 'report';

export interface Decision {
  kind: DecisionKind;
  entity: DecisionEntity;
}

export type Tone = 'success' | 'pending' | 'error' | 'info' | 'neutral';

export interface MerchantApplicationItem {
  ref: string;
  registrationId?: string;
  name: string;
  tin: string;
  merchantId: string;
  category: string;
  date: string;
  status: string;
  address: string;
  fullName?: string;
  phoneNumber?: string;
  tradeName?: string;
  businessLicenseNumber?: string;
  city?: string;
  subCity?: string;
  buildingName?: string;
  floor?: string;
  gpsLocation?: string;
  uploadedFileName?: string;
  uploadedFileSize?: string;
  documentUrl?: string;
  decisionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface TaxReportItem {
  ref: string;
  name: string;
  tin: string;
  period: string;
  category: 'VAT' | 'TOT';
  sales: number;
  tax: number;
  date: string;
  status: string;
}

export interface DirectoryMerchantItem {
  name: string;
  tin: string;
  id: string;
  category: string;
  classification: string;
  status: string;
  authorization: string;
}

export interface AuditEventItem {
  timestamp: string;
  officer: string;
  action: string;
  reference: string;
  statusTransition: string;
  notes: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}
