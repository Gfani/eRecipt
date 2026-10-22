export type ApprovalStatus = 'pending' | 'action_required' | 'approved' | 'rejected';

export interface MerchantApplication {
  id: string;
  businessName: string;
  tradeName: string;
  tin: string;
  taxCategory: 'VAT 15%' | 'TOT 2%' | 'Exempt';
  sector: string;
  applicantName: string;
  phone: string;
  email: string;
  city: string;
  subCity: string;
  building: string;
  submissionDate: string;
  documents: {
    name: string;
    type: string;
    size: string;
    status: 'verified' | 'pending';
  }[];
  status: ApprovalStatus;
  accreditationNo?: string;
  decisionNotes?: string;
}
