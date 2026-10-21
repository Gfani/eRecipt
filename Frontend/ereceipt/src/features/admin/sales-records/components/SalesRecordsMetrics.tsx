import React from 'react';
import styles from './SalesRecordsMetrics.module.css';

interface SalesRecordsMetricsProps {
  recordedSales?: string;
  taxableAmount?: string;
  recordedTax?: string;
}

export const SalesRecordsMetrics: React.FC<SalesRecordsMetricsProps> = ({
  recordedSales = 'ETB 12,604,300',
  taxableAmount = 'ETB 10,960,261',
  recordedTax = 'ETB 1,644,039',
}) => {
  return (
    <div className={styles.metricsGrid}>
      <div className={styles.metricCard}>
        <p className={styles.metricLabel}>Recorded sales</p>
        <p className={styles.metricValue}>{recordedSales}</p>
      </div>
      <div className={styles.metricCard}>
        <p className={styles.metricLabel}>Taxable amount</p>
        <p className={styles.metricValue}>{taxableAmount}</p>
      </div>
      <div className={styles.metricCard}>
        <p className={styles.metricLabel}>Recorded tax</p>
        <p className={styles.metricValue}>{recordedTax}</p>
      </div>
    </div>
  );
};

export default SalesRecordsMetrics;
