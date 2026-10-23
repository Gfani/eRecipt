import React, { useState, useEffect } from 'react';
import { Menu, Wifi, CloudOff, Languages, Bell, ChevronDown } from 'lucide-react';
import { getStoredMerchantProfile } from '../../../features/merchant-registration';
import styles from './Topbar.module.css';

interface TopbarProps {
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu }) => {
  const [apiOnline, setApiOnline] = useState(true);
  const [amharic, setAmharic] = useState(false);
  const [profile, setProfile] = useState(() => getStoredMerchantProfile());

  useEffect(() => {
    const handleUpdate = () => setProfile(getStoredMerchantProfile());
    window.addEventListener('ereceipt:profile_updated', handleUpdate);
    return () => window.removeEventListener('ereceipt:profile_updated', handleUpdate);
  }, []);

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

        <button type="button" className={styles.bellBtn} aria-label="Notifications">
          <Bell size={19} />
          <span className={styles.bellDot} />
        </button>

        <span className={styles.divider} />

        <button type="button" className={styles.userProfile}>
          <span className={styles.userAvatar}>{userInitials}</span>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{profile.fullName || 'Merchant Account'}</p>
            <p className={styles.userRole}>Owner · {profile.tradeName || 'Registered Business'}</p>
          </div>
          <ChevronDown size={14} style={{ color: '#64748B' }} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
