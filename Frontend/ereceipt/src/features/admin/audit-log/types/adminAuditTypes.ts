export interface AdminAuditEntry {
  id: string;
  timestamp: string;
  officerName: string;
  officerId: string;
  actionType: 'MERCHANT_APPROVAL' | 'APPLICATION_REJECTED' | 'CLARIFICATION_REQUESTED' | 'TAX_CLEARANCE_ISSUED' | 'RECORD_FLAGGED';
  targetEntity: string;
  tin: string;
  details: string;
  ipAddress: string;
  hash: string;
}
