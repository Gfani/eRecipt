import React from 'react';
import Logo from '../../components/ui/Logo/Logo';
import styles from './CenteredCardLayout.module.css';

interface CenteredCardLayoutProps {
  children: React.ReactNode;
  onLogoClick?: () => void;
}

export const CenteredCardLayout: React.FC<CenteredCardLayoutProps> = ({
  children,
  onLogoClick,
}) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerSection}>
          <Logo onClick={onLogoClick} />
        </div>
        <div className={styles.card}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CenteredCardLayout;
