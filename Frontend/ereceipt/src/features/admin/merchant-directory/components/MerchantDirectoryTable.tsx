import React from 'react';
import { Search } from 'lucide-react';
import { Badge } from '../../components/Badge';
import type { DirectoryMerchantItem, Tone } from '../../types';
import styles from './MerchantDirectoryTable.module.css';

interface MerchantDirectoryTableProps {
  merchants: DirectoryMerchantItem[];
  onViewDetails: (tin: string) => void;
  getToneForStatus: (status: string) => Tone;
}

export const MerchantDirectoryTable: React.FC<MerchantDirectoryTableProps> = ({
  merchants,
  onViewDetails,
  getToneForStatus,
}) => {
  return (
    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Registered Business Name</th>
            <th className={styles.th}>TIN</th>
            <th className={styles.th}>Merchant ID</th>
            <th className={styles.th}>Category</th>
            <th className={styles.th}>Tax Classification</th>
            <th className={styles.th}>Merchant Status</th>
            <th className={styles.th}>Receipt Authorization</th>
            <th className={styles.th} style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {merchants.map((item) => (
            <tr key={item.tin}>
              <td className={`${styles.td} ${styles.tdMerchant}`}>{item.name}</td>
              <td className={`${styles.td} ${styles.tdTin}`}>{item.tin}</td>
              <td className={styles.td}>{item.id}</td>
              <td className={styles.td}>{item.category}</td>
              <td className={styles.td}>
                <Badge tone="info">{item.classification}</Badge>
              </td>
              <td className={styles.td}>
                <Badge tone={getToneForStatus(item.status)}>{item.status}</Badge>
              </td>
              <td className={styles.td}>
                <Badge tone={getToneForStatus(item.authorization)}>{item.authorization}</Badge>
              </td>
              <td className={styles.td} style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => onViewDetails(item.tin)}
                  className={styles.viewDetailsBtn}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
          {merchants.length === 0 && (
            <tr>
              <td colSpan={8} className={styles.emptyCell}>
                <Search size={28} style={{ margin: '0 auto', color: '#929A95' }} />
                <p className={styles.emptyTitle}>No merchant found</p>
                <p className={styles.emptySubtext}>
                  Check the TIN, merchant ID, or business name and try again.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MerchantDirectoryTable;
