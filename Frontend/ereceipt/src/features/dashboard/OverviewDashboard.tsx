import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  FileText,
  History,
  Database,
  ArrowUpRight,
} from 'lucide-react';
import { getStoredMerchantProfile } from '../merchant-registration';
import styles from './OverviewDashboard.module.css';

interface OverviewDashboardProps {
  onNavigate: (screen: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState(() => getStoredMerchantProfile());

  useEffect(() => {
    const handleUpdate = () => setProfile(getStoredMerchantProfile());
    window.addEventListener('ereceipt:profile_updated', handleUpdate);
    return () => window.removeEventListener('ereceipt:profile_updated', handleUpdate);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const merchantOwnerName = profile.fullName
    ? profile.fullName.split(' ')[0]
    : (profile.tin ? `Merchant (${profile.tin})` : 'Merchant');

  const businessName = profile.tradeName || profile.sellerLegalName || (profile.tin ? `Business (TIN: ${profile.tin})` : 'Registered Business');

  const todayFormatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const cards = [
    {
      id: 'receipt',
      title: 'Issue a receipt',
      desc: 'Create and submit a new fiscal document for clearance.',
      icon: ShoppingBag,
      screen: 'pos',
      className: styles.receiptCard,
    },
    {
      id: 'preview',
      title: 'Tax invoice preview',
      desc: 'Review the official cleared invoice presentation.',
      icon: FileText,
      screen: 'receipt',
      className: styles.previewCard,
    },
    {
      id: 'transactions',
      title: 'Transactions',
      desc: 'Review monthly income, tax, expenses, and cleared records.',
      icon: History,
      screen: 'sales',
      className: styles.transactionsCard,
    },
    {
      id: 'audit',
      title: 'Audit',
      desc: 'Review user actions and MoR EIMS response activity.',
      icon: Database,
      screen: 'audit',
      className: styles.auditCard,
    },
  ];

  return (
    <div className={styles.container}>
      <p className={styles.dateText}>{todayFormatted}</p>
      <h1 className={styles.heading}>{`${getGreeting()}, ${merchantOwnerName}`}</h1>
      <p className={styles.subheading}>
        Real-time MoR EIMS clearance is active for {businessName}.
      </p>

      <div className={styles.cardsGrid}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              type="button"
              className={`${styles.card} ${card.className}`}
              onClick={() => onNavigate(card.screen)}
            >
              <div className={styles.cardTop}>
                <div className={styles.iconWrapper}>
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <div className={styles.arrowIcon}>
                  <ArrowUpRight size={20} strokeWidth={2.4} />
                </div>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewDashboard;
