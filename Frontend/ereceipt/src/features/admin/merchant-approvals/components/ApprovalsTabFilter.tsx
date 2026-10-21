import React from 'react';
import { Search } from 'lucide-react';
import type { ApprovalStatus } from '../types/approvalsTypes';
import styles from './ApprovalsTabFilter.module.css';

interface ApprovalsTabFilterProps {
  currentTab: 'all' | ApprovalStatus;
  onTabChange: (tab: 'all' | ApprovalStatus) => void;
  counts: {
    all: number;
    pending: number;
    action_required: number;
    approved: number;
    rejected: number;
  };
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ApprovalsTabFilter: React.FC<ApprovalsTabFilterProps> = ({
  currentTab,
  onTabChange,
  counts,
  searchQuery,
  onSearchChange,
}) => {
  const tabs = [
    { key: 'all' as const, label: 'All', count: counts.all },
    { key: 'pending' as const, label: 'Pending Review', count: counts.pending },
    { key: 'action_required' as const, label: 'Requires Action', count: counts.action_required },
    { key: 'approved' as const, label: 'Approved', count: counts.approved },
    { key: 'rejected' as const, label: 'Rejected', count: counts.rejected },
  ];

  return (
    <div className={styles.filterBar}>
      <div className={styles.tabsGroup}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''}`}
              onClick={() => onTabChange(tab.key)}
            >
              <span>{tab.label}</span>
              <span className={`${styles.tabBadge} ${isActive ? styles.tabBadgeActive : ''}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search business name or TIN..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ApprovalsTabFilter;
