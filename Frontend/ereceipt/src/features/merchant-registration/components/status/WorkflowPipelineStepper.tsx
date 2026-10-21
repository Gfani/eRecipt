import React from 'react';
import { Clock3, Check, HelpCircle } from 'lucide-react';
import styles from './WorkflowPipelineStepper.module.css';

interface WorkflowPipelineStepperProps {
  referenceNumber?: string;
  submissionDate?: string;
  onReturnToSignIn?: () => void;
  onContactSupport?: () => void;
}

export const WorkflowPipelineStepper: React.FC<WorkflowPipelineStepperProps> = ({
  referenceNumber = 'EIMS-2026-0094',
  submissionDate = '20 October 2026',
  onReturnToSignIn,
  onContactSupport,
}) => {
  const steps = [
    { number: '1', title: 'Submitted', copy: 'Complete', status: 'completed' },
    { number: '2', title: 'MoR validation', copy: 'In progress', status: 'in_progress' },
    { number: '3', title: 'Waiting for approval', copy: 'We will notify you', status: 'pending' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.statusIconWrapper}>
        <Clock3 size={28} />
      </div>

      <div className={styles.badgePending}>
        <span className={styles.badgeDot} />
        <span>EIMS accreditation under review</span>
      </div>

      <h1 className={styles.title}>Thank you. We have your application.</h1>

      <p className={styles.description}>
        Tax identity, VAT certificate, business license, branch geo-fence, and EIMS API credentials are being validated for accreditation.
      </p>

      <div className={styles.referenceBox}>
        <div className={styles.referenceRow}>
          <span className={styles.referenceLabel}>Accreditation reference</span>
          <span className={styles.referenceValue}>{referenceNumber}</span>
        </div>
        <div className={styles.referenceRow}>
          <span className={styles.referenceLabel}>Submitted</span>
          <span className={styles.referenceValue}>{submissionDate}</span>
        </div>
      </div>

      <div className={styles.pipelineGrid}>
        {steps.map((step) => {
          const isDone = step.status === 'completed';
          const isInProgress = step.status === 'in_progress';
          return (
            <div key={step.number} className={styles.pipelineStep}>
              <span
                className={`${styles.stepCircle} ${
                  isDone || isInProgress ? styles.stepCircleActive : styles.stepCirclePending
                }`}
              >
                {isDone ? <Check size={16} strokeWidth={2.5} /> : step.number}
              </span>
              <p className={styles.stepTitle}>{step.title}</p>
              <p className={styles.stepCopy}>{step.copy}</p>
            </div>
          );
        })}
      </div>

      <div className={styles.actionsRow}>
        <button
          type="button"
          className="btn-primary"
          onClick={onReturnToSignIn}
        >
          Return to sign in
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onContactSupport}
        >
          <HelpCircle size={17} />
          <span>Contact support</span>
        </button>
      </div>
    </div>
  );
};

export default WorkflowPipelineStepper;
