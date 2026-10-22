import React, { useState } from 'react';
import { Badge } from './Badge';
import type { Tone, MerchantApplicationItem } from '../types';
import styles from './Approvals.module.css';

interface MerchantApprovalsProps {
  applications: MerchantApplicationItem[];
  onReviewMerchant: (ref: string) => void;
  getToneForStatus: (status: string) => Tone;
  onNavigateToRegistration?: () => void;
}

export const MerchantApprovals: React.FC<MerchantApprovalsProps> = ({
  applications,
  onReviewMerchant,
  getToneForStatus,
  onNavigateToRegistration,
}) => {
  const [filterTab, setFilterTab] = useState('All Applications');
  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All business categories');
  const [statusFilter, setStatusFilter] = useState('All statuses');

  const filterTabs = [
    'All Applications',
    'Pending',
    'Under Review',
    'Additional Information Required',
    'Approved',
    'Rejected',
  ];

  const filteredApplications = applications.filter((item) => {
    const matchesTab = filterTab === 'All Applications' || item.status === filterTab;
    const matchesCategory =
      categoryFilter === 'All business categories' || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'All statuses' || item.status.includes(statusFilter);
    return matchesTab && matchesCategory && matchesStatus;
  });

  return (
    <div className={styles.card}>
      {/* Filter Tabs & Register Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className={styles.tabList} style={{ marginBottom: 0 }}>
          {filterTabs.map((tab) => {
            const isActive = filterTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`${styles.tabButton} ${
                  isActive ? styles.tabButtonActive : styles.tabButtonInactive
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
        {onNavigateToRegistration && (
          <button
            type="button"
            onClick={onNavigateToRegistration}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#1E4D2B',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>+</span>
            <span>Register New Merchant</span>
          </button>
        )}
      </div>

      {/* Inputs Filters */}
      <div className={styles.filterGrid}>
        <input
          type="date"
          className={styles.field}
          aria-label="Submission date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <select
          className={styles.field}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>All business categories</option>
          <option>Retail</option>
          <option>Pharmacy</option>
          <option>Hospitality</option>
          <option>Wholesale</option>
          <option>Automotive</option>
        </select>
        <select
          className={styles.field}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All statuses</option>
          <option>Pending</option>
          <option>Under Review</option>
        </select>
      </div>

      {/* Applications Table */}
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
            {filteredApplications.map((item) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MerchantApprovals;
