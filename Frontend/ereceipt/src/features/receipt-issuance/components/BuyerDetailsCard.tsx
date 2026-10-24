import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import type { BuyerInfo, TransactionMode } from '../types';
import styles from './BuyerDetailsCard.module.css';

interface BuyerDetailsCardProps {
  buyer: BuyerInfo;
  transactionMode: TransactionMode;
  highValueB2C: boolean;
  tinVerified: boolean;
  isVerifyingTin?: boolean;
  onBuyerChange: (patch: Partial<BuyerInfo>) => void;
  onVerifyTin: () => void;
}

export const BuyerDetailsCard: React.FC<BuyerDetailsCardProps> = ({
  buyer,
  transactionMode,
  highValueB2C,
  tinVerified,
  isVerifyingTin = false,
  onBuyerChange,
  onVerifyTin,
}) => {
  const isB2B = transactionMode.startsWith('B2B');
  const isNameRequired = isB2B || highValueB2C;
  const isTinRequired = isB2B;

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Buyer details</h2>
          <p className={styles.copy}>
            Registered and high-value buyers require statutory identification.
          </p>
        </div>

        {tinVerified && (
          <span className={styles.verifiedBadge}>
            <span className={styles.badgeDot} />
            <ShieldCheck size={14} />
            <span>TIN verified by MoR</span>
          </span>
        )}
      </div>

      <div className={styles.grid}>
        {highValueB2C && (
          <div className={styles.highValueAlert}>
            <strong>High-value B2C identification required.</strong> Grand total is at least ETB
            10,000. Enter the buyer’s full name and either a 10-digit TIN or Fayda FIN.
          </div>
        )}

        <div>
          <label className={styles.fieldLabel} htmlFor="buyer-name-input">
            Buyer full / legal name {isNameRequired && '*'}
          </label>
          <input
            id="buyer-name-input"
            required={isNameRequired}
            value={buyer.name}
            onChange={(e) => onBuyerChange({ name: e.target.value })}
            className={styles.inputField}
            placeholder={isB2B ? 'Registered legal business name' : 'Walk-in customer name'}
          />
        </div>

        <div>
          <label className={styles.fieldLabel} htmlFor="buyer-vat-input">
            Buyer VAT registration number
          </label>
          <input
            id="buyer-vat-input"
            value={buyer.vat}
            onChange={(e) => onBuyerChange({ vat: e.target.value })}
            className={styles.inputField}
            placeholder="Optional (e.g. VAT-ET-XXXXXXXXXX)"
          />
        </div>

        <div>
          <label className={styles.fieldLabel} htmlFor="buyer-tin-input">
            Buyer 10-digit TIN {isTinRequired && '*'}
          </label>
          <div className={styles.tinInputRow}>
            <input
              id="buyer-tin-input"
              required={isTinRequired}
              pattern="[0-9]{10}"
              maxLength={10}
              value={buyer.tin}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, '');
                onBuyerChange({ tin: clean });
              }}
              className={styles.inputField}
              placeholder="0000000000"
            />
            <button
              type="button"
              disabled={buyer.tin.length !== 10 || isVerifyingTin}
              onClick={onVerifyTin}
              className={styles.verifyBtn}
            >
              {tinVerified ? <CheckCircle2 size={16} color="#16A34A" /> : null}
              <span>{isVerifyingTin ? 'Verifying...' : tinVerified ? 'Verified' : 'Verify TIN'}</span>
            </button>
          </div>
          <div className={styles.tinHelperRow}>
            <span
              className={
                buyer.tin.length === 10 ? styles.tinHelperValid : styles.tinHelperMuted
              }
            >
              {buyer.tin.length === 10
                ? '✓ 10 digits entered. Ready for MoR verification.'
                : `Must be exactly 10 digits (${buyer.tin.length}/10 digits)`}
            </span>
          </div>
        </div>

        <div>
          <label className={styles.fieldLabel} htmlFor="buyer-fin-input">
            Ethiopian National ID (Fayda FIN)
          </label>
          <input
            id="buyer-fin-input"
            value={buyer.nationalId}
            onChange={(e) => onBuyerChange({ nationalId: e.target.value })}
            className={styles.inputField}
            placeholder="Required for high-value B2C if no TIN"
          />
        </div>

        <div>
          <label className={styles.fieldLabel} htmlFor="buyer-contact-input">
            Buyer phone / email
          </label>
          <input
            id="buyer-contact-input"
            value={buyer.contact}
            onChange={(e) => onBuyerChange({ contact: e.target.value })}
            className={styles.inputField}
            placeholder="SMS or email delivery destination (+251...)"
          />
        </div>

        <label className={styles.checkboxCard}>
          <input
            type="checkbox"
            checked={buyer.designatedAgent}
            disabled={!isB2B}
            onChange={(e) => onBuyerChange({ designatedAgent: e.target.checked })}
            className={styles.checkbox}
          />
          <div>
            <span className={styles.checkboxTitle}>
              Buyer is a Designated Withholding Agent
            </span>
            <span className={styles.checkboxCopy}>
              Required before 2% withholding can be applied. (B2B only)
            </span>
          </div>
        </label>
      </div>
    </section>
  );
};

export default BuyerDetailsCard;
