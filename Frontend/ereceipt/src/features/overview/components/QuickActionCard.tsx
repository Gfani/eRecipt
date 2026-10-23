import React from 'react';
import styles from './QuickActionCard.module.css';

export interface QuickActionCardProps {
  title: string;
  description: string;
  to?: string;
  onClick?: () => void;
  accentColor: 'teal' | 'blue' | 'amber' | 'purple';
  icon: React.ReactNode;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  to,
  onClick,
  accentColor,
  icon,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      window.location.href = to;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`${styles.card} ${styles[accentColor]}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className={styles.topRow}>
        <div className={styles.iconWrapper}>{icon}</div>
        <div className={styles.arrowIcon}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default QuickActionCard;