import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import styles from './AuthMarketingBanner.module.css';

interface AuthMarketingBannerProps {
  headline?: string;
  description?: string;
  features?: string[];
}

export const AuthMarketingBanner: React.FC<AuthMarketingBannerProps> = ({
  headline = 'Build a reliable digital record from your first sale.',
  description = 'Designed for everyday business in Ethiopia, with clear ETB amounts and practical workflows.',
  features = [
    'Faster sale entry',
    'Digital-first receipts',
    'Searchable records',
    'Traceable changes',
  ],
}) => {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.decorativeRing} aria-hidden="true" />
      <div className={styles.decorativeGlow} aria-hidden="true" />

      <div className={styles.contentWrapper}>
        <div className={styles.iconBadge} style={{ backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/logo-icon.png" alt="eReceipt" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
        </div>

        <h2 className={styles.headline}>{headline}</h2>

        <p className={styles.description}>{description}</p>

        <div className={styles.featuresGrid}>
          {features.map((item) => (
            <div key={item} className={styles.featureItem}>
              <CheckCircle2 size={17} className={styles.checkIcon} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthMarketingBanner;
