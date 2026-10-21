import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import AuditFilterBar from './components/AuditFilterBar';
import MonthlyRecordsTable from './components/MonthlyRecordsTable';
import { initialMonthlyRecords } from './types';
import styles from './Audit.module.css';

interface AuditProps {
  onNavigate?: (screen: string) => void;
}

function downloadCsv(filename: string, rows: string[][]) {
  const content = rows
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
    .join('\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export const Audit: React.FC<AuditProps> = ({ onNavigate }) => {
  const [auditStartDate, setAuditStartDate] = useState('2026-01-01');
  const [auditEndDate, setAuditEndDate] = useState('2026-10-31');
  const [calculatedTax, setCalculatedTax] = useState<number | null>(null);
  const [taxApproved, setTaxApproved] = useState(false);

  const visibleAuditMonths = initialMonthlyRecords.filter(
    (record) =>
      record.key >= auditStartDate.slice(0, 7) &&
      record.key <= auditEndDate.slice(0, 7)
  );

  const handleCalculateTax = () => {
    const total = visibleAuditMonths.reduce((sum, item) => sum + item.tax, 0);
    setCalculatedTax(total);
    setTaxApproved(false);
  };

  const handleApproveTax = () => {
    setTaxApproved(true);
  };

  const handleDownloadReport = () => {
    if (calculatedTax === null) return;
    const csvRows = [
      ['Month', 'Income ETB', 'Expenses ETB', 'Tax ETB'],
      ...visibleAuditMonths.map((record) => [
        record.month,
        record.income.toFixed(2),
        record.expenses.toFixed(2),
        record.tax.toFixed(2),
      ]),
      ['Total approved tax', '', '', calculatedTax.toFixed(2)],
    ];
    downloadCsv('approved-tax-calculation-report.csv', csvRows);
  };

  return (
    <DashboardLayout activeScreen="audit" onNavigate={onNavigate}>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Monthly tax review</p>
          <h1 className={styles.title}>Audit</h1>
          <p className={styles.copy}>
            Select a date range to review monthly income, expenses, and tax, then calculate
            the total tax for that period.
          </p>
        </div>
      </div>

      <AuditFilterBar
        startDate={auditStartDate}
        endDate={auditEndDate}
        onStartDateChange={(val) => {
          setAuditStartDate(val);
          setCalculatedTax(null);
          setTaxApproved(false);
        }}
        onEndDateChange={(val) => {
          setAuditEndDate(val);
          setCalculatedTax(null);
          setTaxApproved(false);
        }}
        onCalculateTax={handleCalculateTax}
        calculatedTax={calculatedTax}
        taxApproved={taxApproved}
        onApproveTax={handleApproveTax}
        onDownloadReport={handleDownloadReport}
        monthCount={visibleAuditMonths.length}
      />

      <MonthlyRecordsTable
        records={visibleAuditMonths}
        startDate={auditStartDate}
        endDate={auditEndDate}
      />
    </DashboardLayout>
  );
};

export default Audit;
