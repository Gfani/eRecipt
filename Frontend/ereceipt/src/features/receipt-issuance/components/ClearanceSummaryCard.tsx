import React from 'react';
import { Landmark, ShieldCheck, Loader2 } from 'lucide-react';
import { formatMoney } from '../types';
import styles from './ClearanceSummaryCard.module.css';

interface ClearanceSummaryCardProps {
  subtotal: number;
  exciseTax: number;
  tax: number;
  withholdingTax: number;
  total: number;
  isSubmitting?: boolean;
  canSubmit: boolean;
  validationMessage?: string;
  onSubmit: () => void;
}

export const ClearanceSummaryCard: React.FC<ClearanceSummaryCardProps> = ({
  subtotal,
  exciseTax,
  tax,
  withholdingTax,
  total,
  isSubmitting = false,
  canSubmit,
  validationMessage,
  onSubmit,
}) => {
  return (
    <aside className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Clearance summary</h2>
        <p className={styles.copy}>Amounts submitted to MoR EIMS in ETB</p>
      </div>

      <div className={styles.body}>
        <div className={styles.row}>
          <span>Net subtotal</span>
          <span className={styles.rowValue}>ETB {formatMoney(subtotal)}</span>
        </div>

        <div className={styles.row}>
          <span>Excise tax</span>
          <span className={styles.rowValue}>ETB {formatMoney(exciseTax)}</span>
        </div>

        <div className={styles.row}>
          <span>VAT (15%)</span>
          <span className={styles.rowValue}>ETB {formatMoney(tax)}</span>
        </div>

        {withholdingTax > 0 && (
          <div className={`${styles.row} ${styles.withholdingRow}`}>
            <span>Withholding (2%)</span>
            <span className={styles.rowValue}>− ETB {formatMoney(withholdingTax)}</span>
          </div>
        )}

        <div className={styles.divider} />

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Grand total</span>
          <span className={styles.totalAmount}>ETB {formatMoney(total)}</span>
        </div>

        <div className={styles.noticeBox}>
          <span className={styles.noticeStrong}>
            <ShieldCheck size={16} /> Real-time clearance required
          </span>
          No fiscal document is issued until EIMS returns an IRN, RRN, digital signature, and verification QR payload.
        </div>

        {validationMessage && (
          <div className={styles.validationWarning}>{validationMessage}</div>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className={styles.submitBtn}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Clearing with MoR EIMS...</span>
            </>
          ) : (
            <>
              <Landmark size={18} />
              <span>Submit for MoR clearance</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default ClearanceSummaryCard;
