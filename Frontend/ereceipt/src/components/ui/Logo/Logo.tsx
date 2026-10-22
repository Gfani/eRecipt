import React from 'react';
import logoImg from '../../../assets/logo.png';
import logoWhiteImg from '../../../assets/logo-white.png';
import logoMarkImg from '../../../assets/logo-mark.png';
import styles from './Logo.module.css';

export interface LogoProps {
  inverse?: boolean;
  variant?: 'full' | 'mark';
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

  if (variant === 'mark') {
    return (
      <button
        type="button"
        className={`${styles.logoButton} ${className}`}
        onClick={onClick || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
        aria-label="eReceipt home"
      >
        <span className={`${styles.markWrapper} ${inverse ? styles.markWrapperInverse : ''}`}>
          <img
            src={logoMarkImg}
            alt="eReceipt Mark"
            className={styles.markImage}
            style={customStyle}
          />
        </span>
      </button>
    );
  }

  const imageSrc = inverse ? logoWhiteImg : logoImg;
  const sizeClass =
    size === 'sm'
      ? styles.logoImageSm
      : size === 'lg'
      ? styles.logoImageLg
      : styles.logoImageMd;

  return (
    <button
      type="button"
      className={`${styles.logoButton} ${className}`}
      onClick={onClick || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
      aria-label="eReceipt home"
    >
      <img
        src={imageSrc}
        alt="eReceipt - Digital Receipts. A Stronger Ethiopia."
        className={`${styles.logoImage} ${sizeClass}`}
        style={customStyle}
      />
    </button>
  );
};

export default Logo;
