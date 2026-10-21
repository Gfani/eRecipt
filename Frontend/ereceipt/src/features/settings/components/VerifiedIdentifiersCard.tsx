import React, { useState } from 'react';
import { ShieldCheck, Lock, Copy, Check, Info } from 'lucide-react';
import styles from './VerifiedIdentifiersCard.module.css';

export interface VerifiedIdentifiersCardProps {
  tin?: string;
  merchantReference?: string;
  taxAuthority?: string;
}

export const VerifiedIdentifiersCard: React.FC<VerifiedIdentifiersCardProps> = ({
  tin = '001•••••42',
  merchantReference = 'AM-2081',
  taxAuthority = 'Ministry of Revenues (MoR)',
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (label: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className={styles.card} aria-label="Verified Tax & Merchant Identifiers">
      <div className={styles.header}>
        <div className={styles.icon}>
          <ShieldCheck size={22} strokeWidth={2.2} />
        </div>
        <div className={styles.headerContent}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>Verified Ministry Identifiers</h3>
            <span className={styles.badge}>
              <Check size={12} strokeWidth={3} />
              Accredited
            </span>
          </div>
          <p className={styles.subtitle}>
            Read-only fiscal identifiers bound to your official accredited business profile by {taxAuthority}.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Masked Taxpayer Identification Number */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>
            <Lock size={12} />
            Tax Identification Number (TIN)
          </span>
          <div className={styles.fieldValueRow}>
            <span className={styles.maskedValue}>{tin}</span>
            <button
              type="button"
              className={styles.copyButton}
              onClick={() => handleCopy('tin', tin)}
              aria-label="Copy masked TIN"
              title="Copy TIN"
            >
              {copiedField === 'tin' ? <Check size={15} color="var(--color-success)" /> : <Copy size={15} />}
            </button>
          </div>
        </div>

        {/* Merchant Reference Number */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>
            <Lock size={12} />
            Merchant Reference Code
          </span>
          <div className={styles.fieldValueRow}>
            <span className={styles.maskedValue}>{merchantReference}</span>
            <button
              type="button"
              className={styles.copyButton}
              onClick={() => handleCopy('ref', merchantReference)}
              aria-label="Copy Merchant Reference"
              title="Copy Merchant Reference"
            >
              {copiedField === 'ref' ? <Check size={15} color="var(--color-success)" /> : <Copy size={15} />}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.notice}>
        <Info size={14} className={styles.noticeIcon} />
        <span>
          These identifiers are cryptographically anchored to your MoR EIMS clearance profile and cannot be modified directly.
        </span>
      </div>
    </div>
  );
};

export default VerifiedIdentifiersCard;
