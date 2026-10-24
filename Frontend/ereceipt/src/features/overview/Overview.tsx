import React from 'react';
import { QuickActionGrid } from './components/QuickActionGrid';
import { getStoredMerchantProfile } from '../merchant-registration';
import styles from './Overview.module.css';

export interface OverviewProps {
  onNavigate?: (screen: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  const profile = getStoredMerchantProfile();
  const firstName = profile.fullName ? profile.fullName.split(' ')[0] : 'Tigist';
  const tradeName = profile.tradeName || 'Abeba Market';

  return (
    <div className={styles.container}>
      {/* Header matching exact screenshot */}
      <div className={styles.header}>
        <span className={styles.dateTag}>Tuesday, 20 October 2026</span>
        <h1 className={styles.heading}>Good afternoon, {firstName}</h1>
        <p className={styles.subheading}>
          Real-time MoR EIMS clearance is active for {tradeName}.
        </p>
      </div>

      {/* 2x2 Quick Actions Grid */}
      <QuickActionGrid onNavigate={onNavigate} />
    </div>
  );
};

export default Overview;
