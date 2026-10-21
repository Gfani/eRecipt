import React from 'react';
import { CalendarDays, CircleDollarSign, CheckCircle2, Download } from 'lucide-react';
import styles from './AuditFilterBar.module.css';

interface AuditFilterBarProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onCalculateTax: () => void;
  calculatedTax: number | null;
  taxApproved: boolean;
  onApproveTax: () => void;
  onDownloadReport: () => void;
  monthCount: number;
}

export const AuditFilterBar: React.FC<AuditFilterBarProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onCalculateTax,
  calculatedTax,
  taxApproved,
  onApproveTax,
  onDownloadReport,
  monthCount,
}) => {
  const formattedTax = calculatedTax?.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <div className={styles.filterCard}>
        <div className={styles.filterGrid}>
          <label className="field-group" style={{ marginBottom: 0 }}>
            <span className="field-label">Start date</span>
            <div className={styles.inputWrapper}>
              <CalendarDays size={17} className={styles.inputIcon} />
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className={`field-input ${styles.dateInput}`}
              />
            </div>
          </label>

          <label className="field-group" style={{ marginBottom: 0 }}>
            <span className="field-label">End date</span>
            <div className={styles.inputWrapper}>
              <CalendarDays size={17} className={styles.inputIcon} />
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className={`field-input ${styles.dateInput}`}
              />
            </div>
          </label>

          <button
            type="button"
            className={`btn-primary ${styles.calcTaxBtn}`}
            onClick={onCalculateTax}
            disabled={monthCount === 0}
          >
            <CircleDollarSign size={18} />
            <span>Calculate tax</span>
          </button>
        </div>
      </div>

      {calculatedTax !== null && (
        <div className={styles.summaryBanner}>
          <div className={styles.summaryHeaderRow}>
            <div>
              <p className={styles.summaryEyebrow}>Calculated tax for selected period</p>
              <p className={styles.summaryAmount}>ETB {formattedTax}</p>
              <p className={styles.summaryMeta}>
                {monthCount} months included · {startDate} to {endDate}
              </p>
            </div>

            {taxApproved ? (
              <span className={styles.approvedBadge}>
                <CheckCircle2 size={16} />
                <span>Approved by merchant</span>
              </span>
            ) : (
              <button
                type="button"
                className={`btn-primary ${styles.calcTaxBtn}`}
                onClick={onApproveTax}
              >
                <CheckCircle2 size={18} />
                <span>Approve tax calculation & report</span>
              </button>
            )}
          </div>

          {taxApproved && (
            <div className={styles.approvedRow}>
              <div>
                <p className={styles.approvedTitle}>Tax calculation and report approved</p>
                <p className={styles.approvedCopy}>
                  Approval recorded for this selected reporting period.
                </p>
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={onDownloadReport}
              >
                <Download size={17} />
                <span>Download approved report</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AuditFilterBar;
