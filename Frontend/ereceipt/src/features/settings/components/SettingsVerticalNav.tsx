import React, { useState } from 'react';
import { User, Sliders, Bell, Shield } from 'lucide-react';
import styles from './SettingsVerticalNav.module.css';

export type SettingsTabId = 'profile' | 'preferences' | 'notifications' | 'security';

export interface NavItem {
  id: SettingsTabId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

export interface SettingsVerticalNavProps {
  activeTab?: SettingsTabId;
  onTabChange?: (tabId: SettingsTabId) => void;
}

const NAV_ITEMS: readonly NavItem[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Sliders },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: '2' },
  { id: 'security', label: 'Security', icon: Shield },
];

export const SettingsVerticalNav: React.FC<SettingsVerticalNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<SettingsTabId>('profile');
  const currentTab = activeTab ?? internalTab;

  const handleSelect = (tabId: SettingsTabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalTab(tabId);
    }
  };

  return (
    <nav className={styles.navContainer} aria-label="Settings navigation">
      {NAV_ITEMS.map((item) => {
        const IconComponent = item.icon;
        const isActive = currentTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            className={`${styles.navButton} ${isActive ? styles.navButtonActive : ''}`}
            onClick={() => handleSelect(item.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={styles.icon}>
              <IconComponent size={18} />
            </span>
            <span className={styles.label}>{item.label}</span>
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
          </button>
        );
      })}
    </nav>
  );
};

export default SettingsVerticalNav;
