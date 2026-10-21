import React from 'react';
import Logo from '../../components/ui/Logo/Logo';
import AuthMarketingBanner from './components/AuthMarketingBanner';
import styles from './AuthSplitLayout.module.css';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  bannerHeadline?: string;
  bannerDescription?: string;
  bannerFeatures?: string[];
  footerNote?: string;
  onLogoClick?: () => void;
}

export const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({
  children,
  bannerHeadline,
  bannerDescription,
  bannerFeatures,
  footerNote = 'Your information is used only to operate and secure your account.',
  onLogoClick,
}) => {
  return (
    <div className={styles.splitLayout}>
      <div className={styles.formColumn}>
        <div className={styles.headerSection}>
          <Logo onClick={onLogoClick} />
        </div>

        <div className={styles.centerContent}>
          {children}
        </div>

        {footerNote && (
          <p className={styles.footerNote}>{footerNote}</p>
        )}
      </div>

      <AuthMarketingBanner
        headline={bannerHeadline}
        description={bannerDescription}
        features={bannerFeatures}
      />
    </div>
  );
};

export default AuthSplitLayout;
