import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  ReceiptText,
  Database,
  Settings,
  UserPlus,
  X,
  ChevronDown,
} from 'lucide-react';
import Logo from '../../../components/ui/Logo/Logo';
import { getStoredMerchantProfile } from '../../../features/merchant-registration';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen?: string;
  onNavigate?: (screen: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeScreen = 'audit',
  onNavigate,
}) => {
  const [profile, setProfile] = useState(() => getStoredMerchantProfile());

  useEffect(() => {
    const handleUpdate = () => setProfile(getStoredMerchantProfile());
    window.addEventListener('ereceipt:profile_updated', handleUpdate);
    return () => window.removeEventListener('ereceipt:profile_updated', handleUpdate);
  }, []);

  const merchantInitials = profile.tradeName
    ? profile.tradeName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ME';

  const navItems = [
    { key: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { key: 'pos', label: 'Issue receipt', icon: ShoppingBag },
    { key: 'sales', label: 'Transactions', icon: History },
    { key: 'receipt', label: 'Tax invoice preview', icon: ReceiptText },
    { key: 'audit', label: 'Audit', icon: Database },
  ];

  return (
    <>
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.logoRow}>
          <Logo inverse onClick={() => onNavigate?.('landing')} />
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className={styles.merchantCard}>
          <span className={styles.merchantAvatar}>{merchantInitials}</span>
          <div className={styles.merchantDetails}>
            <p className={styles.merchantName}>{profile.tradeName || 'Merchant Business'}</p>
            <p className={styles.merchantVerified}>
              {profile.status === 'Approved' ? 'Verified merchant' : 'Pending accreditation'}
            </p>
          </div>
          <ChevronDown size={15} style={{ color: '#AFC1CE' }} />
        </div>

        <nav className={styles.navSection}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => {
                  onNavigate?.(item.key);
                  onClose();
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className={styles.bottomSection}>
          <button
            type="button"
            className={`${styles.navItem} ${activeScreen === 'settings' ? styles.navItemActive : ''}`}
            onClick={() => {
              onNavigate?.('settings');
              onClose();
            }}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <button
            type="button"
            className={styles.navItem}
            onClick={() => {
              onNavigate?.('registration');
              onClose();
            }}
          >
            <UserPlus size={18} />
            <span>Merchant registration</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
