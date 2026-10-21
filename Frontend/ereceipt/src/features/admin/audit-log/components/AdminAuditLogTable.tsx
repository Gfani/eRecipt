import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { AdminAuditEntry } from '../types/adminAuditTypes';
import styles from './AdminAuditLogTable.module.css';

interface AdminAuditLogTableProps {
  logs: AdminAuditEntry[];
}

export const AdminAuditLogTable: React.FC<AdminAuditLogTableProps> = ({ logs }) => {
  const getActionBadge = (action: AdminAuditEntry['actionType']) => {
    switch (action) {
      case 'MERCHANT_APPROVAL':
        return <span className={`${styles.actionTag} ${styles.actionApproval}`}>APPROVAL</span>;
      case 'APPLICATION_REJECTED':
        return <span className={`${styles.actionTag} ${styles.actionReject}`}>REJECTED</span>;
      case 'CLARIFICATION_REQUESTED':
        return <span className={`${styles.actionTag} ${styles.actionClarification}`}>CLARIFICATION</span>;
      case 'TAX_CLEARANCE_ISSUED':
        return <span className={`${styles.actionTag} ${styles.actionApproval}`}>TAX CLEARANCE</span>;
      default:
        return <span className={`${styles.actionTag} ${styles.actionDefault}`}>{action}</span>;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.headerBar}>
        <div>
          <h3 className={styles.title}>Officer Administrative Audit Log</h3>
          <p className={styles.subtitle}>
            Append-only tamper-proof ledger of every accreditation and tax modification
          </p>
        </div>

        <div className={styles.sealPill}>
          <ShieldCheck size={14} />
          <span>SHA-256 State Authenticated</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Timestamp</th>
              <th className={styles.th}>Officer Name & ID</th>
              <th className={styles.th}>Action</th>
              <th className={styles.th}>Target Entity / TIN</th>
              <th className={styles.th}>Administrative Details</th>
              <th className={styles.th}>Officer IP</th>
              <th className={styles.th}>Hash Seal</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className={styles.tr}>
                <td className={styles.td}>
                  <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{log.timestamp}</span>
                </td>
                <td className={styles.td}>
                  <div style={{ fontWeight: 600 }}>{log.officerName}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{log.officerId}</div>
                </td>
                <td className={styles.td}>{getActionBadge(log.actionType)}</td>
                <td className={styles.td}>
                  <div style={{ fontWeight: 600 }}>{log.targetEntity}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748B' }}>
                    TIN: {log.tin}
                  </div>
                </td>
                <td className={styles.td}>{log.details}</td>
                <td className={styles.td} style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                  {log.ipAddress}
                </td>
                <td className={`${styles.td} ${styles.hashCell}`}>{log.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogTable;
