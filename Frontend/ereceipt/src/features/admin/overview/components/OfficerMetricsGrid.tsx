import React from 'react';
import { UserCheck, Users, TrendingUp, ShieldAlert } from 'lucide-react';
import type { AdminMetric } from '../types/adminOverviewTypes';
import styles from './OfficerMetricsGrid.module.css';

interface OfficerMetricsGridProps {
  metrics?: AdminMetric[];
}

const defaultMetrics: AdminMetric[] = [
  {
    id: 'pending',
    title: 'Pending Applications',
    value: '3',
    subtext: '+2 submitted today',
    trend: 'up',
    trendValue: '+2',
    accent: 'warning',
  },
  {
    id: 'merchants',
    title: 'Active Merchants',
    value: '142',
    subtext: 'Across all regions',
    trend: 'up',
    trendValue: '99.2%',
    accent: 'primary',
  },
  {
    id: 'tax',
    title: 'Assessed Tax (MTD)',
    value: 'ETB 4.82M',
    subtext: 'Target 95% achieved',
    trend: 'up',
    trendValue: '+14%',
    accent: 'success',
  },
  {
    id: 'compliance',
    title: 'Clearance Rate',
    value: '98.4%',
    subtext: '0 flagged critical',
    trend: 'neutral',
    trendValue: 'Stable',
    accent: 'info',
  },
];

export const OfficerMetricsGrid: React.FC<OfficerMetricsGridProps> = ({
  metrics = defaultMetrics,
}) => {
  const getIcon = (accent: AdminMetric['accent']) => {
    switch (accent) {
      case 'warning':
        return <UserCheck size={20} />;
      case 'primary':
        return <Users size={20} />;
      case 'success':
        return <TrendingUp size={20} />;
      case 'info':
        return <ShieldAlert size={20} />;
    }
  };

  const getIconStyle = (accent: AdminMetric['accent']) => {
    switch (accent) {
      case 'warning':
        return styles.iconWarning;
      case 'primary':
        return styles.iconPrimary;
      case 'success':
        return styles.iconSuccess;
      case 'info':
        return styles.iconInfo;
    }
  };

  return (
    <div className={styles.gridContainer}>
      {metrics.map((metric) => (
        <div key={metric.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>{metric.title}</span>
            <div className={`${styles.iconWrapper} ${getIconStyle(metric.accent)}`}>
              {getIcon(metric.accent)}
            </div>
          </div>
          <div className={styles.cardValue}>{metric.value}</div>
          <div className={styles.cardFooter}>
            {metric.trendValue && (
              <span
                className={`${styles.trendBadge} ${
                  metric.trend === 'up'
                    ? styles.trendUp
                    : metric.trend === 'down'
                    ? styles.trendDown
                    : styles.subtext
                }`}
              >
                {metric.trendValue}
              </span>
            )}
            <span className={styles.subtext}>{metric.subtext}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OfficerMetricsGrid;
