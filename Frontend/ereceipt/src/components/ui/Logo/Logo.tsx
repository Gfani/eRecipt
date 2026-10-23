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
  const imgSrc = variant === 'icon' ? '/logo-icon.png' : '/logo.png';

  return (
    <button
      type="button"
      className={`${styles.logoButton} ${className}`}
      onClick={onClick || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
      aria-label="eReceipt home"
    >
      <img
        src={imgSrc}
        alt="eReceipt - Digital Receipts. A Stronger Ethiopia."
        className={`${styles.logoImg} ${styles[size]} ${inverse ? styles.logoInverse : ''}`}
      />
    </button>
  );
};

export default Logo;
