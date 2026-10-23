import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { TransactionsTable } from './components/TransactionsTable';
import { TransactionDetailsModal } from './components/TransactionDetailsModal';
import { mockMonthlyTransactions } from './data/mockTransactions';
import type { MonthlyTransactionSummary } from './types/TransactionTypes';
import styles from './TransactionsView.module.css';

export interface TransactionsViewProps {
  onNavigate?: (screen: string) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ onNavigate }) => {
  const [selectedRecord, setSelectedRecord] = useState<MonthlyTransactionSummary | null>(null);
  const [selectedYear, setSelectedYear] = useState('2026');

  // Export CSV handler
  const handleExportMonthlyReport = () => {
    const yearRecords = mockMonthlyTransactions.filter((r) => r.year === selectedYear);
    const headers = [
      'Month',
      'Year',
      'Total Income (ETB)',
      'Total Tax (ETB)',
      'Expenses (ETB)',
      'Net Balance (ETB)',
      'Cleared Receipts',
      'Clearance Batch',
      'MoR Status',
    ];

    const rows = yearRecords.map((r) => [
      r.month,
      r.year,
      r.totalIncome.toFixed(2),
      r.totalTax.toFixed(2),
      r.expenses.toFixed(2),
      (r.totalIncome - r.expenses - r.totalTax).toFixed(2),
      String(r.receiptCount || 1500),
      r.clearanceBatch || 'MOR-CLR-2026',
      'Cleared (Real-Time)',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monthly-transactions-report-${selectedYear}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      {/* Page Header matching exact screenshot */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Transactions</h1>
          <p className={styles.subtitle}>
            Review monthly income, tax, and expenses from cleared fiscal records.
          </p>
        </div>

        {/* Export monthly report CTA */}
        <button
          type="button"
          onClick={handleExportMonthlyReport}
          className={styles.exportBtn}
        >
          <Download size={18} className={styles.exportIcon} />
          <span>Export monthly report</span>
        </button>
      </div>

      {/* Main Card with Filter Bar and Table */}
      <TransactionsTable
        records={mockMonthlyTransactions}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        onViewDetails={(record) => setSelectedRecord(record)}
      />

      {/* Details Modal on clicking View details */}
      <TransactionDetailsModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onViewInvoice={() => onNavigate?.('receipt')}
      />
    </div>
  );
};

export default TransactionsView;
