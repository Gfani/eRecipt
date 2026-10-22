import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import styles from './AdminTopbar.module.css';

interface AdminTopbarProps {
  title?: string;
  globalSearch?: string;
  onGlobalSearchChange?: (val: string) => void;
  onGlobalSearchSubmit?: (e: React.FormEvent) => void;
  onProfileClick?: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  title = 'Revenue Administration',
  globalSearch = '',
  onGlobalSearchChange,
  onGlobalSearchSubmit,
  onProfileClick,
  currentPage,
  onNavigate,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'approvals', label: 'Merchant Approvals' },
    { id: 'directory', label: 'Merchant Directory' },
    { id: 'sales', label: 'Sales Records' },
    { id: 'reports', label: 'Tax Reports' },
    { id: 'taxRecords', label: 'Tax Records' },
    { id: 'audit', label: 'Audit Log' },
    { id: 'settings', label: 'Settings' },
  ];
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.titleArea}>
          <p className={styles.pageTitle}>{title}</p>
          <p className={styles.breadcrumb}>Revenue Administration / {title}</p>
        </div>

        {onGlobalSearchSubmit && (
          <form onSubmit={onGlobalSearchSubmit} className={styles.searchForm}>
            <label className={styles.searchWrapper}>
              <Search size={17} className={styles.searchIcon} />
              <input
                value={globalSearch}
                onChange={(e) => onGlobalSearchChange?.(e.target.value)}
                className={styles.searchInput}
                placeholder="Search by TIN, merchant ID, or business name"
              />
            </label>
          </form>
        )}

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
          onClick={onProfileClick}
        >
          <span className={styles.avatarCircle}>HA</span>
          <ChevronDown size={14} style={{ color: '#526059' }} />
        </button>
      </div>

      {onNavigate && (
        <div className={styles.mobileNavRow}>
          {navItems.map((item) => {
            const isActive =
              currentPage === item.id ||
              (item.id === 'approvals' && currentPage === 'merchantReview') ||
              (item.id === 'directory' && currentPage === 'merchantDetails') ||
              (item.id === 'reports' && currentPage === 'reportReview');

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`${styles.mobileNavBtn} ${
                  isActive ? styles.mobileNavBtnActive : styles.mobileNavBtnInactive
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default AdminTopbar;
