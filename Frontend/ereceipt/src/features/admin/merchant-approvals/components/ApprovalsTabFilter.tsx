import React from 'react';
import styles from './ApprovalsTabFilter.module.css';

interface ApprovalsTabFilterProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  dateFilter: string;
  onDateChange: (val: string) => void;
  categoryFilter: string;
  onCategoryChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
}

export const ApprovalsTabFilter: React.FC<ApprovalsTabFilterProps> = ({
  currentTab,
  onTabChange,
  dateFilter,
  onDateChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
}) => {
  const tabs = [
    'All Applications',
    'Pending',
    'Under Review',
    'Additional Information Required',
    'Approved',
    'Rejected',
  ];

  return (
    <div>
      <div className={styles.tabList}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab;
          return (
            <button
              key={tab}
              type="button"
              className={`${styles.tabButton} ${
                isActive ? styles.tabButtonActive : styles.tabButtonInactive
              }`}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className={styles.filterGrid}>
        <input
          type="date"
          className={styles.field}
          aria-label="Submission date"
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
        />
        <select
          className={styles.field}
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
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
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option>All statuses</option>
          <option>Pending</option>
          <option>Under Review</option>
        </select>
      </div>
    </div>
  );
};

export default ApprovalsTabFilter;
