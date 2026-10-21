import React from 'react';
import { AdminAuditLogTable } from '../../features/admin/audit-log/components/AdminAuditLogTable';
import type { AdminAuditEntry } from '../../features/admin/audit-log/types/adminAuditTypes';

const defaultLogs: AdminAuditEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-21 21:42:05',
    officerName: 'Hana Alemu',
    officerId: 'RO-218',
    actionType: 'MERCHANT_APPROVAL',
    targetEntity: 'Abyssinia Trading PLC',
    tin: '0048192041',
    details: 'Issued accreditation certificate EIMS-2026-0094 with verified Trade License',
    ipAddress: '196.188.12.44',
    hash: '9a8f...3d12',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-21 19:15:30',
    officerName: 'Hana Alemu',
    officerId: 'RO-218',
    actionType: 'CLARIFICATION_REQUESTED',
    targetEntity: 'Lucy Traditional Coffee Roasters',
    tin: '0039281720',
    details: 'Requested re-upload of expired regional trade permit seal',
    ipAddress: '196.188.12.44',
    hash: 'b4c1...8f9e',
  },
];

export const AdminAuditLogPage: React.FC = () => {
  return (
    <div>
      <AdminAuditLogTable logs={defaultLogs} />
    </div>
  );
};

export default AdminAuditLogPage;
