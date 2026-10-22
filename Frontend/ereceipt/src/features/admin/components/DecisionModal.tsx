import React from 'react';
import { X } from 'lucide-react';
import type { Decision } from '../types';
import styles from './DecisionModal.module.css';

interface DecisionModalProps {
  decision: Decision;
  reason: string;
  onReasonChange: (reason: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  decision,
  reason,
  onReasonChange,
  onCancel,
  onConfirm,
}) => {
  const getActionTitle = () => {
    const action =
      decision.kind === 'approve'
        ? 'Approve'
        : decision.kind === 'request'
        ? 'Request more information'
        : 'Reject';
    const target = decision.entity === 'merchant' ? 'merchant application' : 'tax report';
    return `${action} ${target}`;
  };

  const isConfirmDisabled = decision.kind !== 'approve' && !reason.trim();

  return (
    <div className={styles.backdrop} onMouseDown={onCancel}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <p className={styles.preTitle}>Confirm administrative decision</p>
            <h2 className={styles.title}>{getActionTitle()}</h2>
          </div>
          <button type="button" className={styles.closeButton} onClick={onCancel} aria-label="Close modal">
            <X size={19} />
          </button>
        </div>

        <p className={styles.notice}>
          This prototype action updates the review status and appends an administrative audit entry. It does not
          access an official government system.
        </p>

        {decision.kind !== 'approve' && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="decision-reason">
              Reason required
            </label>
            <textarea
              id="decision-reason"
              className={styles.textarea}
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Provide the decision reason or requested information"
            />
          </div>
        )}

        <div className={styles.footer}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.confirmButton} ${
              decision.kind === 'reject' ? styles.confirmReject : styles.confirmApprove
            }`}
            onClick={onConfirm}
            disabled={isConfirmDisabled}
          >
            Confirm decision
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecisionModal;
