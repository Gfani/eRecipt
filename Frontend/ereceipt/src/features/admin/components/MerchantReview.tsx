import React from 'react';
import { ArrowLeft, FileText, Eye } from 'lucide-react';
import { Badge } from './Badge';
import type { Tone, MerchantApplicationItem, Decision } from '../types';
import styles from './Approvals.module.css';

interface MerchantReviewProps {
  application: MerchantApplicationItem;
  onBack: () => void;
  onOpenDecision: (decision: Decision) => void;
  getToneForStatus: (status: string) => Tone;
}

export const MerchantReview: React.FC<MerchantReviewProps> = ({
  application,
  onBack,
  onOpenDecision,
  getToneForStatus,
}) => {
  if (!application) {
    return (
      <div className={styles.reviewContainer}>
        <button type="button" onClick={onBack} className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Back to applications</span>
        </button>
        <div className={styles.card} style={{ textAlign: 'center', padding: '48px 16px' }}>
          <p style={{ margin: 0, color: '#667069' }}>No application selected for review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.reviewContainer}>
      <button type="button" onClick={onBack} className={styles.backBtn}>
        <ArrowLeft size={16} />
        <span>Back to applications</span>
      </button>

      <div className={styles.reviewGrid}>
        {/* Left Section: Submitted Information */}
        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionRef}>{application.ref}</p>
            <h2 className={styles.sectionTitle}>Submitted Information</h2>
          </div>

          <dl className={styles.infoDl}>
            <div>
              <dt className={styles.dt}>Registered Business Name</dt>
              <dd className={styles.dd}>{application.name}</dd>
            </div>
            <div>
              <dt className={styles.dt}>Merchant ID</dt>
              <dd className={styles.dd}>{application.merchantId}</dd>
            </div>
            <div>
              <dt className={styles.dt}>TIN</dt>
              <dd className={styles.dd}>{application.tin}</dd>
            </div>
            <div>
              <dt className={styles.dt}>Business Category</dt>
              <dd className={styles.dd}>{application.category}</dd>
            </div>
            <div>
              <dt className={styles.dt}>Business Address</dt>
              <dd className={styles.dd}>{application.address}</dd>
            </div>
            <div>
              <dt className={styles.dt}>Submitted</dt>
              <dd className={styles.dd}>{application.date}</dd>
            </div>
          </dl>

          <div className={styles.docsSection}>
            <h3 className={styles.docsTitle}>Submitted documents</h3>
            <div className={styles.docsGrid}>
              {['Trade Licence.pdf', 'Business Registration.pdf', 'Representative ID.pdf'].map(
                (file) => (
                  <button
                    key={file}
                    type="button"
                    className={styles.docItem}
                    onClick={() => alert(`Previewing ${file}`)}
                  >
                    <FileText className={styles.docIcon} style={{ color: '#176B4D' }} size={20} />
                    <span className={styles.docName}>{file}</span>
                    <Eye size={15} style={{ marginLeft: 'auto', color: '#667069' }} />
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* Right Section: Verification Checklist & Notes */}
        <section className={styles.card} style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#17201B', margin: 0 }}>
              Verification
            </h2>
            <Badge tone={getToneForStatus(application.status)}>{application.status}</Badge>
          </div>

          <div className={styles.checkList}>
            {[
              'Trade licence is legible and current',
              'Business name matches registration document',
              'Representative identity document provided',
              'Address information is complete',
            ].map((item, index) => (
              <label key={item} className={styles.checkLabel}>
                <input
                  type="checkbox"
                  defaultChecked={index < 3}
                  className={styles.checkInput}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <div className={styles.statusBoxes}>
            <div className={styles.statusBox}>
              <p className={styles.statusBoxLabel}>TIN verification status</p>
              <p className={styles.statusBoxValue} style={{ color: '#176B4D' }}>
                Prototype match found
              </p>
            </div>
            <div className={styles.statusBox}>
              <p className={styles.statusBoxLabel}>Business identity match</p>
              <p className={styles.statusBoxValue} style={{ color: '#17201B' }}>
                Requires officer confirmation
              </p>
            </div>
          </div>

          <label style={{ display: 'block', marginTop: '20px' }}>
            <span style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
              Taxpayer classification
            </span>
            <select className={styles.field} defaultValue="VAT">
              <option>VAT</option>
              <option>TOT</option>
              <option>Needs Further Review</option>
            </select>
          </label>

          <label style={{ display: 'block', marginTop: '20px' }}>
            <span style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
              Officer notes
            </span>
            <textarea
              className={styles.field}
              style={{ minHeight: '96px', resize: 'vertical' }}
              placeholder="Record verification findings"
            />
          </label>

          <label style={{ display: 'block', marginTop: '20px' }}>
            <span style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
              Verification evidence / reference
            </span>
            <input className={styles.field} placeholder="Internal evidence reference" />
          </label>
        </section>
      </div>

      {/* Bottom Action Bar */}
      <div className={styles.actionsBar}>
        <button
          type="button"
          onClick={() => onOpenDecision({ kind: 'request', entity: 'merchant' })}
          className={styles.btnRequest}
        >
          Request More Information
        </button>
        <button
          type="button"
          onClick={() => onOpenDecision({ kind: 'reject', entity: 'merchant' })}
          className={styles.btnReject}
        >
          Reject Application
        </button>
        <button
          type="button"
          onClick={() => onOpenDecision({ kind: 'approve', entity: 'merchant' })}
          className={styles.btnApprove}
        >
          Approve Merchant
        </button>
      </div>
    </div>
  );
};

export default MerchantReview;
