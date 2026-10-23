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
  ReceiptText,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSignOut?: () => void;
  officer?: { name?: string; role?: string; badgeNumber?: string } | null;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPage,
  onNavigate,
  onSignOut,
  officer,
}) => {
  const officerName = officer?.name || 'Revenue Officer';
  const officerRole = officer?.role
    ? officer.role === 'ADMIN'
      ? 'System Administrator'
      : officer.role === 'SENIOR_AUDITOR'
      ? 'Senior Tax Auditor'
      : 'Revenue Officer'
    : 'Senior Revenue Officer';
  const officerInitials = officer?.name
    ? officer.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'RO';
  const navItems: [string, string, React.ComponentType<{ size?: number }>][] = [
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
          <ReceiptText size={19} />
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
          <span className={styles.officerAvatar}>{officerInitials}</span>
          <div className={styles.officerDetails}>
            <span className={styles.officerName}>{officerName}</span>
            <span className={styles.officerRole}>{officerRole}</span>
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
