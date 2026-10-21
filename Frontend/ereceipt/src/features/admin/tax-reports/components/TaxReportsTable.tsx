import React from 'react';
import { Download } from 'lucide-react';
import type { AdminTaxReportItem } from '../types/taxReportsTypes';
import styles from './TaxReportsTable.module.css';

interface TaxReportsTableProps {
  reports: AdminTaxReportItem[];
}

export const TaxReportsTable: React.FC<TaxReportsTableProps> = ({ reports }) => {
  const totalDeclaredSales = reports.reduce((acc, r) => acc + r.declaredSales, 0);
  const totalTaxPayable = reports.reduce((acc, r) => acc + r.calculatedTax, 0);

  const getStatusBadge = (status: AdminTaxReportItem['filingStatus']) => {
    switch (status) {
      case 'reconciled':
        return <span className={`${styles.badge} ${styles.statusReconciled}`}>Reconciled</span>;
      case 'payment_pending':
        return <span className={`${styles.badge} ${styles.statusPending}`}>Payment Pending</span>;
      case 'discrepancy_flagged':
        return <span className={`${styles.badge} ${styles.statusFlagged}`}>Audit Flagged</span>;
    }
  };

  const formatETB = (amount: number) => {
    return `ETB ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.topBar}>
        <div className={styles.titleGroup}>
          <h3>Periodic Fiscal & Tax Assessment Roll</h3>
          <p>Reconciled electronic eReceipt totals vs merchant declared tax liabilities</p>
        </div>

        <div className={styles.summaryMetrics}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Sales Declared</span>
            <span className={styles.summaryValue}>{formatETB(totalDeclaredSales)}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Tax Assessed</span>
            <span className={styles.summaryValue} style={{ color: '#0D9488' }}>
              {formatETB(totalTaxPayable)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Tax Period</th>
              <th className={styles.th}>Merchant / Trade Name</th>
              <th className={styles.th}>TIN</th>
              <th className={styles.th}>Declared Sales</th>
              <th className={styles.th}>Deductible Expenses</th>
              <th className={styles.th}>Calculated Tax</th>
              <th className={styles.th}>Filing Status</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Filing Slip</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className={styles.tr}>
                <td className={styles.td}>
                  <strong>{r.period}</strong>
                </td>
                <td className={styles.td}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.merchantName}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{r.tradeName}</div>
                  </div>
                </td>
                <td className={styles.td}>
                  <span className={styles.tinCode}>{r.tin}</span>
                </td>
                <td className={`${styles.td} ${styles.currencyCell}`}>
                  {formatETB(r.declaredSales)}
                </td>
                <td className={`${styles.td} ${styles.currencyCell}`}>
                  {formatETB(r.declaredExpenses)}
                </td>
                <td className={`${styles.td} ${styles.currencyCell}`} style={{ color: '#0D9488' }}>
                  {formatETB(r.calculatedTax)}
                </td>
                <td className={styles.td}>{getStatusBadge(r.filingStatus)}</td>
                <td className={styles.td} style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    style={{
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                    }}
                    onClick={() => alert(`Downloading clearance voucher for TIN ${r.tin}`)}
                  >
                    <Download size={12} />
                    <span>PDF</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaxReportsTable;
