import React from 'react';
import { CheckCircle2, XCircle, HelpCircle, AlertTriangle } from 'lucide-react';
import type { RecentDecision } from '../types/adminOverviewTypes';
import styles from './RecentDecisionsFeed.module.css';

interface RecentDecisionsFeedProps {
  decisions?: RecentDecision[];
}

const defaultDecisions: RecentDecision[] = [
  {
    id: 'dec-1',
    officerName: 'Hana Alemu',
    officerId: 'RO-218',
    action: 'approved',
    targetMerchant: 'Abyssinia Trading PLC',
    tin: '0048192041',
    referenceNo: 'EIMS-2026-0094',
    timestamp: '12 mins ago',
    notes: 'All 3 business license credentials validated. Accreditation certificate issued.',
  },
  {
    id: 'dec-2',
    officerName: 'Hana Alemu',
    officerId: 'RO-218',
    action: 'clarification',
    targetMerchant: 'Lucy Leather Goods',
    tin: '0039281720',
    timestamp: '45 mins ago',
    notes: 'Requested updated trade license document with readable expiration seal.',
  },
  {
    id: 'dec-3',
    officerName: 'Dawit Tadesse',
    officerId: 'RO-104',
    action: 'flagged',
    targetMerchant: 'Sheger Fresh Mart',
    tin: '0029481720',
    timestamp: '2 hours ago',
    notes: 'Reconciliation difference of ETB 12,400.00 between TOT filing and eReceipt log.',
  },
  {
    id: 'dec-4',
    officerName: 'Hana Alemu',
    officerId: 'RO-218',
    action: 'approved',
    targetMerchant: "Kaldi's Coffee Bole",
    tin: '0019284729',
    referenceNo: 'EIMS-2026-0093',
    timestamp: '3 hours ago',
    notes: 'VAT 15% category verified against ERCA central database.',
  },
];

export const RecentDecisionsFeed: React.FC<RecentDecisionsFeedProps> = ({
  decisions = defaultDecisions,
}) => {
  const getActionBadge = (action: RecentDecision['action']) => {
    switch (action) {
      case 'approved':
        return (
          <div className={`${styles.actionIcon} ${styles.iconApproved}`} title="Approved">
            <CheckCircle2 size={18} />
          </div>
        );
      case 'rejected':
        return (
          <div className={`${styles.actionIcon} ${styles.iconRejected}`} title="Rejected">
            <XCircle size={18} />
          </div>
        );
      case 'clarification':
        return (
          <div className={`${styles.actionIcon} ${styles.iconClarification}`} title="Clarification Requested">
            <HelpCircle size={18} />
          </div>
        );
      case 'flagged':
        return (
          <div className={`${styles.actionIcon} ${styles.iconFlagged}`} title="Flagged for Audit">
            <AlertTriangle size={18} />
          </div>
        );
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Recent Officer Decisions</h2>
          <span className={styles.subtitle}>Recorded decisions with cryptographic audit stamps</span>
        </div>
      </div>

      <div className={styles.feedList}>
        {decisions.map((decision) => (
          <div key={decision.id} className={styles.feedItem}>
            {getActionBadge(decision.action)}

            <div className={styles.contentCol}>
              <div className={styles.itemHeading}>
                <span className={styles.merchantName}>{decision.targetMerchant}</span>
                <span className={styles.timestamp}>{decision.timestamp}</span>
              </div>

              <div className={styles.detailsRow}>
                <span>TIN: <strong className={styles.tinTag}>{decision.tin}</strong></span>
                {decision.referenceNo && (
                  <span>Ref: <strong>{decision.referenceNo}</strong></span>
                )}
                <span>Officer: {decision.officerName} ({decision.officerId})</span>
              </div>

              {decision.notes && <p className={styles.notes}>{decision.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDecisionsFeed;
