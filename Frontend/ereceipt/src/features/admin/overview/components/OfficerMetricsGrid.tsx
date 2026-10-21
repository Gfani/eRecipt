import React from 'react';
import { UserCheck, Building2, FileText, AlertCircle } from 'lucide-react';
import styles from './OfficerMetricsGrid.module.css';

export const OfficerMetricsGrid: React.FC = () => {
  const metricCards = [
    {
      label: 'Pending Merchant Applications',
      value: '12',
      detail: '4 received today',
      icon: UserCheck,
      bgColor: '#FFF7E6',
      iconColor: '#A85D08',
    },
    {
      label: 'Approved Merchants',
      value: '1,284',
      detail: '23 this month',
      icon: Building2,
      bgColor: '#E8F5EE',
      iconColor: '#176B4D',
    },
    {
      label: 'Pending Tax Reports',
      value: '18',
      detail: '6 nearing review target',
      icon: FileText,
      bgColor: '#EEF2FF',
      iconColor: '#4F46E5',
    },
    {
      label: 'Reports Requiring Information',
      value: '7',
      detail: 'Officer response required',
      icon: AlertCircle,
      bgColor: '#FEF2F2',
      iconColor: '#B91C1C',
    },
  ];

  return (
    <div className={styles.metricsGrid}>
      {metricCards.map((m) => {
        const IconComponent = m.icon;
        return (
          <div key={m.label} className={styles.metricCard}>
            <div className={styles.metricTop}>
              <p className={styles.metricLabel}>{m.label}</p>
              <span
                className={styles.metricIconBox}
                style={{ backgroundColor: m.bgColor, color: m.iconColor }}
              >
                <IconComponent size={18} />
              </span>
            </div>
            <p className={styles.metricValue}>{m.value}</p>
            <p className={styles.metricDetail}>{m.detail}</p>
          </div>
        );
      })}
    </div>
  );
};

export default OfficerMetricsGrid;
