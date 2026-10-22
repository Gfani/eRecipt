import React, { useState } from 'react';
import type { MonthlyTransactionSummary } from '../types/TransactionTypes';
import styles from './TransactionsTable.module.css';

interface TransactionsTableProps {
  records: MonthlyTransactionSummary[];
  onViewDetails?: (record: MonthlyTransactionSummary) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  records,
  onViewDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Currency Formatter
  const formatETB = (amount: number) => {
    return `ETB ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Filter records by search and selected year
  const filteredRecords = records.filter((r) => {
    const matchesMonth = r.month.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !selectedYear || r.year === selectedYear;
    return matchesMonth && matchesYear;
  });

  return (
    <div className={styles.tableCard}>
      {/* Search & Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search month"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Year Filter Pill */}
        <div className={styles.yearSelectWrapper}>
          <svg
            className={styles.calendarIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className={styles.yearSelect}
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
          <svg
            className={styles.chevronIcon}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Responsive Table */}
      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Total income</th>
              <th>Total tax</th>
              <th>Expenses</th>
              <th className={styles.detailsHeader}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((item) => (
              <tr key={item.id} className={styles.tableRow}>
                {/* Month & Year Stacked */}
                <td className={styles.monthCell}>
                  <span className={styles.monthName}>{item.month}</span>
                  <span className={styles.yearText}>{item.year}</span>
                </td>

                {/* Total Income */}
                <td className={styles.incomeCell}>{formatETB(item.totalIncome)}</td>

                {/* Total Tax */}
                <td className={styles.taxCell}>{formatETB(item.totalTax)}</td>

                {/* Expenses */}
                <td className={styles.expensesCell}>{formatETB(item.expenses)}</td>

                {/* Action Button */}
                <td className={styles.actionCell}>
                  <button
                    type="button"
                    onClick={() => onViewDetails?.(item)}
                    className={styles.viewDetailsBtn}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>View details</span>
                  </button>
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  {searchTerm
                    ? `No monthly transactions found matching "${searchTerm}".`
                    : `No monthly transactions found for ${selectedYear}.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};