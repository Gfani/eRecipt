import React, { useState, useEffect, useRef } from 'react';
import { Menu, Wifi, CloudOff, Languages, Bell, ChevronDown, Settings, ShieldCheck, LogOut } from 'lucide-react';
import { getStoredMerchantProfile } from '../../../features/merchant-registration';
import styles from './Topbar.module.css';

interface TopbarProps {
  onToggleMobileMenu: () => void;
  onNavigate?: (screen: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu, onNavigate }) => {
  const [apiOnline, setApiOnline] = useState(true);
  const [amharic, setAmharic] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(() => getStoredMerchantProfile());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUpdate = () => setProfile(getStoredMerchantProfile());
    window.addEventListener('ereceipt:profile_updated', handleUpdate);
    return () => window.removeEventListener('ereceipt:profile_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const userInitials = profile.fullName
    ? profile.fullName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ME';

  return (
    <header className={styles.topbar}>
      <div className={styles.leftSection}>
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className={styles.mobileMenuBtn}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          onClick={() => setApiOnline(!apiOnline)}
          className={`${styles.apiStatusPill} ${!apiOnline ? styles.apiStatusPillOffline : ''}`}
        >
          {apiOnline ? <Wifi size={14} /> : <CloudOff size={14} />}
          <span>
            {apiOnline ? 'MoR EIMS API: Connected (Real-Time)' : 'MoR EIMS API: Offline'}
          </span>
        </button>
      </div>

      <div className={styles.rightSection}>
        <button
          type="button"
          onClick={() => setAmharic(!amharic)}
          className={styles.langToggleBtn}
        >
          <Languages size={15} />
          <span>{amharic ? 'English' : 'አማርኛ'}</span>
        </button>

        <button
          type="button"
          className={styles.bellBtn}
          aria-label="Notifications"
          onClick={() => alert('All fiscal compliance notifications are up to date.')}
        >
          <Bell size={19} />
          <span className={styles.bellDot} />
        </button>

        <span className={styles.divider} />

        <div className={styles.profileWrapper} ref={dropdownRef}>
          <button
            type="button"
            className={styles.userProfile}
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            aria-expanded={profileMenuOpen}
            aria-label="Merchant account menu"
          >
            <span className={styles.userAvatar}>{userInitials}</span>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{profile.fullName || 'Merchant Account'}</p>
              <p className={styles.userRole}>Owner · {profile.tradeName || 'Registered Business'}</p>
            </div>
            <ChevronDown
              size={14}
              style={{
                color: '#64748B',
                transform: profileMenuOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s ease',
              }}
            />
          </button>

          {profileMenuOpen && (
            <div className={styles.profileDropdown}>
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => {
                  setProfileMenuOpen(false);
                  onNavigate?.('settings');
                }}
              >
                <Settings size={15} />
                <span>Merchant Settings</span>
              </button>

              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => {
                  setProfileMenuOpen(false);
                  onNavigate?.('admin');
                }}
              >
                <ShieldCheck size={15} />
                <span>Switch to Revenue Admin</span>
              </button>

              <div className={styles.dropdownDivider} />

              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                onClick={() => {
                  setProfileMenuOpen(false);
                  localStorage.removeItem('ereceipt_token');
                  localStorage.removeItem('merchant_token');
                  localStorage.removeItem('ereceipt_merchant');
                  localStorage.removeItem('merchant_user');
                  onNavigate?.('signin');
                }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
