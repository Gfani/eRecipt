import React from 'react';
import { ReceiptText, Check } from 'lucide-react';
import styles from './Logo.module.css';

interface LogoProps {
  inverse?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ inverse = false, onClick }) => {
  return (
    <button
      type="button"
      className={styles.logoButton}
      onClick={onClick || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
      aria-label="eReceipt home"
    >
      <span className={`${styles.iconWrapper} ${inverse ? styles.iconWrapperInverse : ''}`}>
        <ReceiptText size={20} strokeWidth={2.2} />
        <span className={styles.badgeCheck}>
          <Check size={9} strokeWidth={3} />
        </span>
      </span>
      <span className={`${styles.brandName} ${inverse ? styles.brandNameInverse : ''}`}>
        eReceipt
      </span>
    </button>
  );
};

export default Logo;
