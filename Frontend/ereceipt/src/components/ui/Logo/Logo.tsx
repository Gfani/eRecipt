import React from 'react';
import logoImg from '../../../assets/logo.png';
import logoMarkImg from '../../../assets/logo-mark.png';
import styles from './Logo.module.css';

export interface LogoProps {
  inverse?: boolean;
  variant?: 'full' | 'icon' | 'mark';
  size?: 'sm' | 'md' | 'lg';
  height?: number;
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  inverse = false,
  variant = 'full',
  size = 'md',
  height,
  onClick,
  className = '',
}) => {
  const customStyle: React.CSSProperties = height ? { height: `${height}px` } : {};

  return (
    <button
      type="button"
      className={`${styles.logoButton} ${className}`}
      onClick={onClick || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
      aria-label="eReceipt home"
    >
      {variant === 'mark' ? (
        <span className={`${styles.markWrapper} ${inverse ? styles.markWrapperInverse : ''}`}>
          <img
            src={logoMarkImg}
            alt="eReceipt Mark"
            className={styles.markImage}
            style={customStyle}
          />
        </span>
      ) : inverse ? (
        /* Merchant & Admin Dashboard Sidebar: White rounded badge box + bold white eReceipt text */
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
        /* Full horizontal logo */
        <img
          src={variant === 'icon' ? '/logo-icon.png' : logoImg}
          alt="eReceipt - Digital Receipts. A Stronger Ethiopia."
          className={`${styles.fullLogoImg} ${styles[size]}`}
          style={customStyle}
        />
      )}
    </button>
  );
};

export default Logo;
