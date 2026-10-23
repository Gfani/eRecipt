import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { PaymentMethod } from '../types';
import { formatMoney } from '../types';
import styles from './PaymentWithholdingCard.module.css';

interface PaymentWithholdingCardProps {
  paymentMethod: PaymentMethod;
  paymentReference: string;
  withholding: boolean;
  withholdingEligible: boolean;
  isDesignatedAgent: boolean;
  withholdingReference: string;
  goodsSubtotal: number;
  servicesSubtotal: number;
  withholdingTax: number;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPaymentReferenceChange: (ref: string) => void;
  onWithholdingChange: (checked: boolean) => void;
  onWithholdingReferenceChange: (ref: string) => void;
}

export const PaymentWithholdingCard: React.FC<PaymentWithholdingCardProps> = ({
  paymentMethod,
  paymentReference,
  withholding,
  withholdingEligible,
  isDesignatedAgent,
  withholdingReference,
  goodsSubtotal,
  servicesSubtotal,
  withholdingTax,
  onPaymentMethodChange,
  onPaymentReferenceChange,
  onWithholdingChange,
  onWithholdingReferenceChange,
}) => {
  const requiresPaymentReference =
    paymentMethod !== 'Cash' && paymentMethod !== 'Credit' && paymentMethod !== 'Check';

  const canApplyWithholding = isDesignatedAgent && withholdingEligible;

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Payment and withholding</h2>
        <p className={styles.copy}>
          Provide the settlement channel and apply withholding only when both agent and threshold conditions are met.
        </p>
      </div>

      <div className={styles.grid}>
        <div>
          <label className={styles.fieldLabel} htmlFor="payment-method-select">
            Payment method
          </label>
          <select
            id="payment-method-select"
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value as PaymentMethod)}
            className={styles.selectField}
          >
            <option value="Cash">Cash</option>
            <option value="Telebirr">Telebirr</option>
            <option value="CBE Birr">CBE Birr</option>
            <option value="M-Pesa">M-Pesa</option>
            <option value="Bank Transfer — CBE">Bank Transfer — CBE</option>
            <option value="Bank Transfer — Awash">Bank Transfer — Awash</option>
            <option value="Bank Transfer — Abyssinia">Bank Transfer — Abyssinia</option>
            <option value="Bank Transfer — Dashen">Bank Transfer — Dashen</option>
            <option value="Check">Check</option>
            <option value="Credit">Credit</option>
          </select>
        </div>

        <div>
          <label className={styles.fieldLabel} htmlFor="payment-ref-input">
            Payment transaction reference {requiresPaymentReference && '*'}
          </label>
          <input
            id="payment-ref-input"
            required={requiresPaymentReference}
            value={paymentReference}
            onChange={(e) => onPaymentReferenceChange(e.target.value)}
            className={styles.inputField}
            placeholder={
              requiresPaymentReference
                ? 'Provider or bank transaction reference (e.g. CBE-FT-884291)'
                : 'Optional reference / internal memo'
            }
          />
        </div>

        <div
          className={`${styles.indicatorBox} ${
            withholdingEligible ? styles.indicatorBoxEligible : ''
          }`}
        >
          <AlertCircle
            size={18}
            className={`${styles.indicatorIcon} ${
              withholdingEligible ? styles.indicatorIconEligible : ''
            }`}
          />
          <div>
            <p className={styles.indicatorTitle}>Statutory threshold indicator</p>
            <p className={styles.indicatorCopy}>
              Applicable to B2B Goods &gt; 10,000 ETB or Services &gt; 3,000 ETB. Current goods: ETB{' '}
              {formatMoney(goodsSubtotal)} · Services: ETB {formatMoney(servicesSubtotal)}
              {withholdingEligible ? ' (Threshold met)' : ' (Below threshold)'}
            </p>
          </div>
        </div>

        <label className={styles.checkboxCard}>
          <input
            type="checkbox"
            checked={withholding && canApplyWithholding}
            disabled={!canApplyWithholding}
            onChange={(e) => onWithholdingChange(e.target.checked)}
            className={styles.checkbox}
          />
          <div>
            <span className={styles.checkboxTitle}>Apply 2% Withholding Tax</span>
            <span className={styles.checkboxCopy}>
              Calculated on the pre-tax net subtotal, excluding VAT. Requires a designated
              withholding agent and an eligible threshold.
              {!isDesignatedAgent && ' (Buyer must be marked as Designated Withholding Agent)'}
            </span>
          </div>
        </label>

        {withholdingTax > 0 && (
          <div className={styles.fullCol}>
            <label className={styles.fieldLabel} htmlFor="withholding-ref-input">
              Buyer Withholding Receipt Reference *
            </label>
            <input
              id="withholding-ref-input"
              required
              value={withholdingReference}
              onChange={(e) => onWithholdingReferenceChange(e.target.value)}
              className={styles.inputField}
              placeholder="Enter buyer-issued withholding receipt reference (e.g. WHT-2026-9921)"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default PaymentWithholdingCard;
