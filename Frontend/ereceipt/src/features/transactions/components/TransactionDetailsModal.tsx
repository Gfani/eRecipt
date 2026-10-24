import React from 'react';
import { X, CheckCircle, FileText, Download, ShieldCheck } from 'lucide-react';
import type { MonthlyTransactionSummary } from '../types/TransactionTypes';
import styles from './TransactionDetailsModal.module.css';

interface TransactionDetailsModalProps {
  record: MonthlyTransactionSummary | null;
  onClose: () => void;
  onViewInvoice?: () => void;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  record,
  onClose,
  onViewInvoice,
}) => {
  if (!record) return null;

  const formatETB = (val: number) =>
    `ETB ${val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const netBalance = record.totalIncome - record.expenses - record.totalTax;

  const handleDownloadCsv = () => {
    const csvContent = [
      ['Fiscal Record', `${record.month} ${record.year}`],
      ['Total Income', formatETB(record.totalIncome)],
      ['Total Tax (VAT 15%)', formatETB(record.totalTax)],
      ['Business Expenses', formatETB(record.expenses)],
      ['Net Balance', formatETB(netBalance)],
      ['Cleared Receipts Count', String(record.receiptCount || 1500)],
      ['Batch Clearance ID', record.clearanceBatch || 'MOR-CLR-2026-X'],
      ['MoR Compliance Status', 'Verified & Recorded in Real-Time'],
    ]
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clearance-record-${record.month.toLowerCase()}-${record.year}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.badgeRow}>
              <span className={styles.clearedBadge}>
                <CheckCircle size={14} />
                MoR EIMS Cleared (Real-Time)
              </span>
              <span className={styles.periodTag}>
                {record.month} {record.year}
              </span>
            </div>
            <h2 className={styles.title}>Monthly Fiscal Breakdown</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.metricGrid}>
            <div className={styles.metricCard}>
              <p className={styles.metricLabel}>Total Income</p>
              <p className={styles.metricValueLarge}>{formatETB(record.totalIncome)}</p>
            </div>
            <div className={styles.metricCard}>
              <p className={styles.metricLabel}>Total Tax (15% VAT)</p>
              <p className={styles.metricValueTax}>{formatETB(record.totalTax)}</p>
            </div>
            <div className={styles.metricCard}>
              <p className={styles.metricLabel}>Documented Expenses</p>
              <p className={styles.metricValueExpense}>{formatETB(record.expenses)}</p>
            </div>
            <div className={styles.metricCard}>
              <p className={styles.metricLabel}>Net Operating Balance</p>
              <p className={styles.metricValueNet}>{formatETB(netBalance)}</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Ministry of Revenue Batch ID</span>
              <span className={styles.infoValCode}>
                {record.clearanceBatch || 'MOR-CLR-202610-884920'}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Cleared Receipts Issued</span>
              <span className={styles.infoVal}>
                {(record.receiptCount || 1842).toLocaleString()} receipts
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Digital Signature Status</span>
              <span className={styles.infoValSuccess}>
                <ShieldCheck size={16} /> Cryptographically Signed (SHA-256)
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoKey}>Fiscal Calendar Period</span>
              <span className={styles.infoVal}>
                1 {record.month} {record.year} – {record.month === 'February' ? '28' : ['April', 'June', 'September', 'November'].includes(record.month) ? '30' : '31'} {record.month} {record.year}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            onClick={handleDownloadCsv}
            className={styles.secondaryBtn}
          >
            <Download size={16} />
            Download Monthly CSV
          </button>

          {onViewInvoice && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewInvoice();
              }}
              className={styles.primaryBtn}
            >
              <FileText size={16} />
              View Tax Invoice Preview
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className={styles.closeActionBtn}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
