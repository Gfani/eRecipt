import React from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle, ShieldX } from 'lucide-react';
import type { DirectoryMerchant } from '../types/directoryTypes';
import styles from './MerchantDirectoryTable.module.css';

interface MerchantDirectoryTableProps {
  merchants: DirectoryMerchant[];
  onSelectMerchant?: (merchant: DirectoryMerchant) => void;
}

export const MerchantDirectoryTable: React.FC<MerchantDirectoryTableProps> = ({
  merchants,
  onSelectMerchant,
}) => {
  const getStatusBadge = (status: DirectoryMerchant['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className={`${styles.badge} ${styles.statusActive}`}>
            <CheckCircle2 size={12} />
            <span>Active</span>
          </span>
        );
      case 'under_audit':
        return (
          <span className={`${styles.badge} ${styles.statusAudit}`}>
            <AlertTriangle size={12} />
            <span>Under Audit</span>
          </span>
        );
      case 'suspended':
        return (
          <span className={`${styles.badge} ${styles.statusSuspended}`}>
            <ShieldX size={12} />
            <span>Suspended</span>
          </span>
        );
    }
  };

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Legal Business & Trade Name</th>
              <th className={styles.th}>TIN</th>
              <th className={styles.th}>Sector</th>
              <th className={styles.th}>Tax Regime</th>
              <th className={styles.th}>Location</th>
              <th className={styles.th}>Accreditation Ref</th>
              <th className={styles.th}>Taxpayer Status</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {merchants.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  No registered merchants found matching this query.
                </td>
              </tr>
            ) : (
              merchants.map((m) => (
                <tr key={m.id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.businessCell}>
                      <span className={styles.businessName}>{m.legalName}</span>
                      <span className={styles.tradeName}>{m.tradeName}</span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.tinCode}>{m.tin}</span>
                  </td>
                  <td className={styles.td}>{m.sector}</td>
                  <td className={styles.td}>{m.taxCategory}</td>
                  <td className={styles.td}>{m.city}, {m.subCity}</td>
                  <td className={styles.td}>
                    <span className={styles.accreditationPill}>{m.accreditationNo}</span>
                  </td>
                  <td className={styles.td}>{getStatusBadge(m.status)}</td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => onSelectMerchant?.(m)}
                    >
                      <span>Ledger</span>
                      <ExternalLink size={12} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MerchantDirectoryTable;
