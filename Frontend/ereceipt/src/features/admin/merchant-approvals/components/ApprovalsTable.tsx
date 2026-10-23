import React from 'react';
import { Badge } from '../../components/Badge';
import type { MerchantApplicationItem, Tone } from '../../types';
import styles from './ApprovalsTable.module.css';

interface ApprovalsTableProps {
  applications: MerchantApplicationItem[];
  onReviewMerchant: (ref: string) => void;
  getToneForStatus: (status: string) => Tone;
}

export const ApprovalsTable: React.FC<ApprovalsTableProps> = ({
  applications,
  onReviewMerchant,
  getToneForStatus,
}) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Application Reference</th>
            <th className={styles.th}>Merchant Name</th>
            <th className={styles.th}>TIN</th>
            <th className={styles.th}>Merchant ID</th>
            <th className={styles.th}>Business Category</th>
            <th className={styles.th}>Submitted</th>
            <th className={styles.th}>Verification Status</th>
            <th className={styles.th} style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px', color: '#667069' }}>
                No merchant applications found.
              </td>
            </tr>
          ) : (
            applications.map((item) => (
              <tr key={item.ref}>
                <td className={`${styles.td} ${styles.tdRef}`}>{item.ref}</td>
                <td className={`${styles.td} ${styles.tdMerchant}`}>{item.name}</td>
                <td className={styles.td}>{item.tin}</td>
                <td className={styles.td}>{item.merchantId}</td>
                <td className={styles.td}>{item.category}</td>
                <td className={styles.td}>{item.date}</td>
                <td className={styles.td}>
                  <Badge tone={getToneForStatus(item.status)}>{item.status}</Badge>
                </td>
                <td className={styles.td} style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => onReviewMerchant(item.ref)}
                    className={styles.reviewBtn}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalsTable;
