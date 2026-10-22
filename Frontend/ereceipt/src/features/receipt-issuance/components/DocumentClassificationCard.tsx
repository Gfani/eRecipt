import React from 'react';
import { Link2 } from 'lucide-react';
import type { DocumentType, TransactionMode } from '../types';
import styles from './DocumentClassificationCard.module.css';

interface DocumentClassificationCardProps {
  documentType: DocumentType;
  transactionMode: TransactionMode;
  originalIrn: string;
  adjustmentReason: string;
  onDocumentTypeChange: (docType: DocumentType) => void;
  onTransactionModeChange: (mode: TransactionMode) => void;
  onOriginalIrnChange: (val: string) => void;
  onAdjustmentReasonChange: (val: string) => void;
}

export const DocumentClassificationCard: React.FC<DocumentClassificationCardProps> = ({
  documentType,
  transactionMode,
  originalIrn,
  adjustmentReason,
  onDocumentTypeChange,
  onTransactionModeChange,
  onOriginalIrnChange,
  onAdjustmentReasonChange,
}) => {
  const isAdjustment = documentType.startsWith('Credit') || documentType.startsWith('Debit');

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Document classification</h2>
        <p className={styles.copy}>
          The selected fiscal document determines validation and MoR clearance requirements.
        </p>
      </div>

      <div className={styles.grid}>
        <div>
          <label className={styles.fieldLabel} htmlFor="doc-type-select">
            Document type
          </label>
          <select
            id="doc-type-select"
            value={documentType}
            onChange={(e) => onDocumentTypeChange(e.target.value as DocumentType)}
            className={styles.selectField}
          >
            <option value="Electronic Tax Invoice (VAT Invoice)">
              Electronic Tax Invoice (VAT Invoice)
            </option>
            <option value="Electronic Cash / Payment Receipt">
              Electronic Cash / Payment Receipt
            </option>
            <option value="Credit Note">Credit Note</option>
            <option value="Debit Note">Debit Note</option>
          </select>
        </div>

        <div>
          <span className={styles.fieldLabel}>Transaction mode</span>
          <div className={styles.modeSegment}>
            {(['B2B / Registered Buyer', 'B2C / Walk-in Customer'] as TransactionMode[]).map(
              (mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onTransactionModeChange(mode)}
                  className={`${styles.modeBtn} ${
                    transactionMode === mode ? styles.modeBtnActive : ''
                  }`}
                >
                  {mode}
                </button>
              )
            )}
          </div>
        </div>

        {isAdjustment && (
          <>
            <div>
              <label className={styles.fieldLabel} htmlFor="orig-irn-input">
                Original IRN reference *
              </label>
              <div className={styles.inputWithIconWrapper}>
                <Link2 size={17} className={styles.inputIcon} />
                <input
                  id="orig-irn-input"
                  required
                  value={originalIrn}
                  onChange={(e) => onOriginalIrnChange(e.target.value)}
                  className={`${styles.inputField} ${styles.inputWithIcon}`}
                  placeholder="IRN-ET-2026-000000000"
                />
              </div>
            </div>

            <div>
              <label className={styles.fieldLabel} htmlFor="adjust-reason-select">
                Adjustment reason code *
              </label>
              <select
                id="adjust-reason-select"
                required
                value={adjustmentReason}
                onChange={(e) => onAdjustmentReasonChange(e.target.value)}
                className={styles.selectField}
              >
                <option value="">Select mandatory reason</option>
                <option value="01: Returned Goods">01: Returned Goods</option>
                <option value="02: Defective or Damaged Goods">02: Defective or Damaged Goods</option>
                <option value="03: Post-Sale Discount / Price Reduction">
                  03: Post-Sale Discount / Price Reduction
                </option>
                <option value="04: Pricing or Quantity Error on Original Invoice">
                  04: Pricing or Quantity Error on Original Invoice
                </option>
                <option value="05: Cancelled Supply">05: Cancelled Supply</option>
              </select>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default DocumentClassificationCard;
