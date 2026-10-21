import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import type { AdminPage } from '../types';
import styles from './AdminHeader.module.css';

interface AdminHeaderProps {
  currentPage: AdminPage;
  pageTitles: Record<AdminPage, string>;
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
  onGlobalSearchSubmit: (e: React.FormEvent) => void;
  onNavigate: (page: AdminPage) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentPage,
  pageTitles,
  globalSearch,
  onGlobalSearchChange,
  onGlobalSearchSubmit,
  onNavigate,
}) => {
  const mobileNavItems: [AdminPage, string][] = [
    ['overview', 'Overview'],
    ['approvals', 'Approvals'],
    ['directory', 'Directory'],
    ['sales', 'Sales'],
    ['reports', 'Reports'],
    ['taxRecords', 'Tax Records'],
    ['audit', 'Audit'],
    ['settings', 'Settings'],
  ];

  const currentTitle = pageTitles[currentPage] || 'Revenue Administration';

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.titleArea}>
          <p className={styles.pageTitle}>{currentTitle}</p>
          <p className={styles.breadcrumb}>Revenue Administration / {currentTitle}</p>
        </div>

        <form onSubmit={onGlobalSearchSubmit} className={styles.searchForm}>
          <label className={styles.searchWrapper}>
            <Search size={17} className={styles.searchIcon} />
            <input
              value={globalSearch}
              onChange={(e) => onGlobalSearchChange(e.target.value)}
              className={styles.searchInput}
              placeholder="Search by TIN, merchant ID, or business name"
            />
          </label>
        </form>

        <button
          type="button"
          className={styles.iconButton}
          aria-label="Notifications"
          onClick={() => alert('All review notifications are up to date.')}
        >
          <Bell size={19} />
          <span className={styles.notificationDot} />
        </button>

        <button
          type="button"
          className={styles.avatarButton}
          aria-label="Officer profile"
          onClick={() => onNavigate('settings')}
        >
          <span className={styles.avatarCircle}>HA</span>
          <ChevronDown size={14} style={{ color: '#526059' }} />
        </button>
      </div>

      <div className={styles.mobileNav}>
        {mobileNavItems.map(([target, label]) => {
          const isActive = currentPage === target;
          return (
            <button
              key={target}
              type="button"
              onClick={() => onNavigate(target)}
              className={`${styles.mobileNavButton} ${
                isActive ? styles.mobileNavButtonActive : styles.mobileNavButtonInactive
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default AdminHeader;
