import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import type { TaxReportItem, Decision } from '../types';
import styles from './TaxReports.module.css';

interface TaxReportReviewProps {
  report: TaxReportItem;
  onBack: () => void;
  onOpenDecision: (decision: Decision) => void;
}

export const TaxReportReview: React.FC<TaxReportReviewProps> = ({
  report,
  onBack,
  onOpenDecision,
}) => {
  if (!report) {
    return (
      <div className={styles.reviewContainer}>
        <button type="button" onClick={onBack} className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Back to tax reports</span>
        </button>
        <p style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
          No tax report selected or available for review.
        </p>
      </div>
    );
  }

  const recordedSales = 1468900;
  const difference = report.sales - recordedSales;

  return (
    <div className={styles.reviewContainer}>
      <button type="button" onClick={onBack} className={styles.backBtn}>
        <ArrowLeft size={16} />
        <span>Back to tax reports</span>
      </button>

      {/* Top 2 Columns */}
      <div className={styles.twoColGrid}>
        {/* Merchant Information */}
        <section className={styles.section}>
          <p style={{ margin: 0, fontSize: '12px', fontFamily: 'monospace', color: '#667069' }}>
            {report.ref}
          </p>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 700, color: '#17201B' }}>
            Merchant Information
          </h2>

          <dl
            style={{
              marginTop: '20px',
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            }}
          >
            {[
              ['Business Name', report.name],
              ['TIN', report.tin],
              ['Merchant ID', 'MER-10476'],
              ['Tax Classification', report.category],
              ['Registration Status', 'Approved'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt style={{ fontSize: '12px', color: '#667069' }}>{label}</dt>
                <dd style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 600, color: '#17201B' }}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Report Summary */}
        <section className={styles.section}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#17201B' }}>
            Report Summary
          </h2>

          <dl style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              ['Reporting Period', report.period],
              ['Declared Total Sales', `ETB ${report.sales.toLocaleString()}`],
              ['Taxable Sales', 'ETB 1,289,130'],
              ['Exempt Sales', 'ETB 193,370'],
              ['Reported Tax', `ETB ${report.tax.toLocaleString()}`],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderBottom: '1px solid #EDF0ED',
                  paddingBottom: '10px',
                  fontSize: '14px',
                }}
              >
                <dt style={{ color: '#667069' }}>{label}</dt>
                <dd style={{ margin: 0, fontWeight: 600, color: '#17201B' }}>{value}</dd>
              </div>
            ))}
          </dl>

          <button
            type="button"
            style={{
              marginTop: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#176B4D',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            onClick={() => alert('Opening supporting-sales-schedule.pdf')}
          >
            <FileText size={16} />
            <span>View supporting-sales-schedule.pdf</span>
          </button>
        </section>
      </div>

      {/* Sales Reconciliation */}
      <section className={styles.section}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#17201B' }}>
          Sales Reconciliation
        </h2>

        <div className={styles.reconcileGrid}>
          <div className={styles.reconcileCard}>
            <p style={{ margin: 0, fontSize: '12px', color: '#667069' }}>Recorded sales</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 700, color: '#17201B' }}>
              ETB {recordedSales.toLocaleString()}
            </p>
          </div>

          <div className={styles.reconcileCard}>
            <p style={{ margin: 0, fontSize: '12px', color: '#667069' }}>Merchant-declared sales</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 700, color: '#17201B' }}>
              ETB {report.sales.toLocaleString()}
            </p>
          </div>

          <div className={styles.reconcileCardDiff}>
            <p style={{ margin: 0, fontSize: '12px', color: '#A85D08' }}>Difference for review</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 700, color: '#92400E' }}>
              ETB {difference.toLocaleString()}
            </p>
          </div>
        </div>

        <div className={styles.explanationAlert}>
          <b>Merchant explanation:</b> Difference relates to two month-end receipts cleared after the
          internal reporting cut-off. This explanation requires officer review and does not itself
          establish non-compliance.
        </div>
      </section>

      {/* Tax Review */}
      <section className={styles.section}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#17201B' }}>
          Tax Review
        </h2>

        <div
          style={{
            marginTop: '20px',
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          }}
        >
          <label style={{ display: 'block' }}>
            <span style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
              Applicable tax category
            </span>
            <select className={styles.field} defaultValue={report.category}>
              <option>{report.category}</option>
              <option>Needs Further Review</option>
            </select>
          </label>

          <label style={{ display: 'block' }}>
            <span style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
              Supporting evidence reference
            </span>
            <input className={styles.field} placeholder="Evidence or internal reference" />
          </label>

          <label style={{ display: 'block', gridColumn: '1 / -1' }}>
            <span style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
              Officer review notes
            </span>
            <textarea
              className={styles.field}
              style={{ minHeight: '96px', resize: 'vertical' }}
              placeholder="Record reconciliation findings and decision basis"
            />
          </label>
        </div>
      </section>

      {/* Decision Buttons */}
      <div className={styles.actionsBar}>
        <button
          type="button"
          onClick={() => onOpenDecision({ kind: 'request', entity: 'report' })}
          style={{
            borderRadius: '8px',
            border: '1px solid #D97706',
            backgroundColor: '#FFFFFF',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#A85D08',
            cursor: 'pointer',
          }}
        >
          Request More Information
        </button>
        <button
          type="button"
          onClick={() => onOpenDecision({ kind: 'reject', entity: 'report' })}
          style={{
            borderRadius: '8px',
            border: '1px solid #DC2626',
            backgroundColor: '#FFFFFF',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#B91C1C',
            cursor: 'pointer',
          }}
        >
          Reject Report
        </button>
        <button
          type="button"
          onClick={() => onOpenDecision({ kind: 'approve', entity: 'report' })}
          style={{
            borderRadius: '8px',
            backgroundColor: '#123D2C',
            border: 'none',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#FFFFFF',
            cursor: 'pointer',
          }}
        >
          Approve Report
        </button>
      </div>

      <p className={styles.subNotice}>
        Approving this report updates its review status and related tax record. It does not mark the
        tax as assessed or paid.
      </p>
    </div>
  );
};

export default TaxReportReview;
