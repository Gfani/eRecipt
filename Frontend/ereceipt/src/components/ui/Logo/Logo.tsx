import React from 'react';
import styles from './Logo.module.css';

interface LogoProps {
  inverse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  inverse = false,
  size = 'md',
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      className={`${styles.brandButton} ${styles[size]} ${className}`}
      onClick={onClick || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
      aria-label="eReceipt home"
    >
      <span className={`${styles.brandIcon} ${inverse ? styles.brandIconInverse : ''}`}>
        <img
          src="/logo-icon.png"
          alt="eReceipt"
          className={`${styles.logoImg} ${inverse ? styles.logoImgInverse : ''}`}
        />
      </span>
      <span className={`${styles.brandName} ${inverse ? styles.brandNameInverse : ''}`}>
        eReceipt
      </span>
    </button>
  );
};

export default Logo;
