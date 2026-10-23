import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Building2,
  History,
  FileText,
  ClipboardCheck,
  Database,
  Settings,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import type { AdminPage } from '../types';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onSignOut: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPage,
  onNavigate,
  onSignOut,
}) => {
  const navItems: [AdminPage, string, React.ComponentType<{ size?: number }>][] = [
    ['overview', 'Overview', LayoutDashboard],
    ['approvals', 'Merchant Approvals', UserCheck],
    ['directory', 'Merchant Directory', Building2],
    ['sales', 'Sales Records', History],
    ['reports', 'Tax Reports', FileText],
    ['taxRecords', 'Tax Records', ClipboardCheck],
    ['audit', 'Audit Log', Database],
    ['settings', 'Settings', Settings],
  ];

  return (
    <aside className={styles.sidebar}>
      <button
        type="button"
        onClick={() => onNavigate('overview')}
        className={styles.logoRow}
      >
        <span className={styles.logoIcon}>
          <img src="/logo-icon.png" alt="eReceipt Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
        </span>
        <span className={styles.logoText}>eReceipt</span>
      </button>

      <p className={styles.sectionHeading}>Revenue administration</p>

      <nav className={styles.navGroup}>
        {navItems.map(([target, label, IconComponent]) => {
          const isActive =
            currentPage === target ||
            (target === 'approvals' && currentPage === 'merchantReview') ||
            (target === 'directory' && currentPage === 'merchantDetails') ||
            (target === 'reports' && currentPage === 'reportReview');

          return (
            <button
              key={target}
              type="button"
              onClick={() => onNavigate(target)}
              className={`${styles.navButton} ${
                isActive ? styles.navButtonActive : styles.navButtonInactive
              }`}
            >
              <IconComponent size={17} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className={styles.bottomArea}>
        <div className={styles.officerCard}>
          <span className={styles.officerAvatar}>HA</span>
          <div className={styles.officerDetails}>
            <span className={styles.officerName}>Hana Alemu</span>
            <span className={styles.officerRole}>Senior Revenue Officer</span>
          </div>
          <ChevronDown size={14} style={{ color: '#AFC5B6' }} />
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className={styles.signOutBtn}
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
