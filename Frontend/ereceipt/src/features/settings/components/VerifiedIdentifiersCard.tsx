import React, { useState } from 'react';
import { ShieldCheck, Lock, Copy, Check, Info, Eye, EyeOff } from 'lucide-react';
import styles from './VerifiedIdentifiersCard.module.css';

export interface VerifiedIdentifiersCardProps {
  tin?: string;
  merchantReference?: string;
  taxAuthority?: string;
}

export const VerifiedIdentifiersCard: React.FC<VerifiedIdentifiersCardProps> = ({
  tin = '—',
  merchantReference = '—',
  taxAuthority = 'Ministry of Revenues (MoR)',
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showFullTin, setShowFullTin] = useState(false);

  const rawTin = tin && tin !== '—' ? tin.trim() : '';

  const maskedTin =
    rawTin && rawTin.length === 10
      ? `${rawTin.slice(0, 3)}•••••${rawTin.slice(-2)}`
      : rawTin || '—';

  const displayedTin = showFullTin ? (rawTin || '—') : maskedTin;

  const handleCopy = (label: string, textToCopy: string) => {
    if (!textToCopy || textToCopy === '—') return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      // ignore
    }
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
        {/* Taxpayer Identification Number */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>
            <Lock size={12} />
            Tax Identification Number (TIN)
          </span>
          <div className={styles.fieldValueRow}>
            <span
              className={styles.maskedValue}
              title={showFullTin ? 'Full TIN' : 'Masked for security (Click eye to view)'}
            >
              {displayedTin}
            </span>
            <div className={styles.actionButtons}>
              {rawTin && rawTin !== '—' && (
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={() => setShowFullTin((prev) => !prev)}
                  aria-label={showFullTin ? 'Hide full TIN' : 'Show full TIN'}
                  title={showFullTin ? 'Hide full TIN' : 'Show full TIN'}
                >
                  {showFullTin ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              )}
              {rawTin && rawTin !== '—' && (
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={() => handleCopy('tin', rawTin)}
                  aria-label="Copy full TIN"
                  title={copiedField === 'tin' ? 'Copied full TIN!' : 'Copy full TIN'}
                >
                  {copiedField === 'tin' ? (
                    <Check size={15} color="var(--color-success)" />
                  ) : (
                    <Copy size={15} />
                  )}
                </button>
              )}
            </div>
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
            {merchantReference && merchantReference !== '—' && (
              <button
                type="button"
                className={styles.copyButton}
                onClick={() => handleCopy('ref', merchantReference)}
                aria-label="Copy Merchant Reference"
                title={copiedField === 'ref' ? 'Copied reference!' : 'Copy Merchant Reference'}
              >
                {copiedField === 'ref' ? (
                  <Check size={15} color="var(--color-success)" />
                ) : (
                  <Copy size={15} />
                )}
              </button>
            )}
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
