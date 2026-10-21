import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeScreen?: string;
  onNavigate?: (screen: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeScreen = 'audit',
  onNavigate,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={styles.layoutContainer}>
      <Sidebar
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        activeScreen={activeScreen}
        onNavigate={onNavigate}
      />

      <div className={styles.mainWrapper}>
        <Topbar onToggleMobileMenu={() => setMobileNavOpen(!mobileNavOpen)} />
        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
