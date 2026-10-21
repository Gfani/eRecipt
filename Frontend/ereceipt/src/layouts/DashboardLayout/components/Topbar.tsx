import React, { useState } from 'react';
import { Menu, Wifi, CloudOff, Languages, Bell, ChevronDown } from 'lucide-react';
import styles from './Topbar.module.css';

interface TopbarProps {
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu }) => {
  const [apiOnline, setApiOnline] = useState(true);
  const [amharic, setAmharic] = useState(false);

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
          <span className={styles.userAvatar}>TG</span>
          <div className={styles.userInfo}>
            <p className={styles.userName}>Tigist Getachew</p>
            <p className={styles.userRole}>Owner</p>
          </div>
          <ChevronDown size={14} style={{ color: '#64748B' }} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
