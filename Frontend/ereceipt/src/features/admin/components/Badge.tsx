import React from 'react';
import type { Tone } from '../types';
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
}

export const Badge: React.FC<BadgeProps> = ({ children, tone = 'neutral' }) => {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      <span className={styles.dot} />
      {children}
    </span>
  );
};

export default Badge;
