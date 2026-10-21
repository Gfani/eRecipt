import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Building2,
  FileText,
  Database,
  LogOut,
  ShieldCheck,
  Wifi,
} from 'lucide-react';
import Logo from '../../components/ui/Logo/Logo';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingApprovalsCount?: number;
  onSignOut?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  pendingApprovalsCount = 3,
  onSignOut,
}) => {
  const navItems = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'approvals', label: 'Approvals', icon: UserCheck, badge: pendingApprovalsCount },
    { key: 'directory', label: 'Merchant Directory', icon: Building2 },
    { key: 'reports', label: 'Tax Reports', icon: FileText },
    { key: 'audit', label: 'Audit Trail', icon: Database },
  ];

  return (
    <div className={styles.layoutContainer}>
      {/* Admin Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <Logo inverse />
          <span className={styles.authorityBadge}>Ministry of Revenues</span>
        </div>

        <div className={styles.officerCard}>
          <span className={styles.officerAvatar}>HA</span>
          <div className={styles.officerDetails}>
            <p className={styles.officerName}>Hana Alemu</p>
            <p className={styles.officerRole}>Officer ID: RO-218</p>
          </div>
        </div>

        <nav className={styles.navSection}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => onTabChange(item.key)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {Boolean(item.badge) && item.badge! > 0 && (
                  <span className={styles.navBadge}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className={styles.bottomSection}>
          <button
            type="button"
            className={styles.navItem}
            onClick={onSignOut}
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <header className={styles.topbar}>
          <div className={styles.portalTitle}>
            <ShieldCheck size={18} style={{ color: '#0D9488' }} />
            <span>EIMS Central Revenue Administration Portal</span>
          </div>

          <div className={styles.statusPill}>
            <Wifi size={14} />
            <span>Clearance Gateway: Operational</span>
          </div>
        </header>

        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
