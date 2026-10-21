import React from 'react';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminTopbar } from './components/AdminTopbar';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  title?: string;
  onSignOut?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  title = 'Revenue Administration',
  onSignOut,
}) => {
  return (
    <div className={styles.layoutContainer} style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F7F5EF' }}>
      <AdminSidebar
        currentPage={activeTab}
        onNavigate={onTabChange}
        onSignOut={onSignOut}
      />

      <div className={styles.mainWrapper}>
        <AdminTopbar
          title={title}
          onProfileClick={() => onTabChange('settings')}
          currentPage={activeTab}
          onNavigate={onTabChange}
        />
        <main style={{ padding: '24px 28px', maxWidth: '1600px', width: '100%', margin: '0 auto', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
