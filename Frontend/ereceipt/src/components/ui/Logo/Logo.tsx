import React from 'react';
import styles from './Logo.module.css';

interface LogoProps {
  inverse?: boolean;
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  inverse = false,
  variant = 'full',
  size = 'md',
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      className={`${styles.logoButton} ${className}`}
      onClick={onClick || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
      aria-label="eReceipt home"
    >
      {inverse ? (
        /* Merchant Dashboard Sidebar: White rounded badge box + bold white eReceipt text */
        <span className={styles.sidebarBadgeRow}>
          <span className={styles.iconBox}>
            <img
              src="/logo-icon.png"
              alt="eReceipt Logo"
              className={styles.iconImg}
            />
          </span>
          <span className={styles.brandTitle}>eReceipt</span>
        </span>
      ) : (
        /* Merchant Registration & Auth pages: Full horizontal logo, sized prominently */
        <img
          src={variant === 'icon' ? '/logo-icon.png' : '/logo.png'}
          alt="eReceipt - Digital Receipts. A Stronger Ethiopia."
          className={`${styles.fullLogoImg} ${styles[size]}`}
        />
      )}
    </button>
  );
};

export default Logo;
