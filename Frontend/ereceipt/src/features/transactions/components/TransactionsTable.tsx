import React, { useState } from 'react';
import type { MonthlyTransactionSummary } from '../types/TransactionTypes';
import styles from './TransactionsTable.module.css';

interface TransactionsTableProps {
  records: MonthlyTransactionSummary[];
  onViewDetails?: (record: MonthlyTransactionSummary) => void;
  selectedYear?: string;
  onYearChange?: (year: string) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  records,
  onViewDetails,
  selectedYear: controlledYear,
  onYearChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [internalYear, setInternalYear] = useState('2026');

  const currentYear = controlledYear !== undefined ? controlledYear : internalYear;

  const handleYearChange = (year: string) => {
    if (onYearChange) {
      onYearChange(year);
    } else {
      setInternalYear(year);
    }
  };

  // Currency Formatter
  const formatETB = (amount: number) => {
    return `ETB ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Filter records by search term and selected year
  const filteredRecords = records.filter((r) => {
    const matchesMonth = r.month.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !currentYear || r.year === currentYear;
    return matchesMonth && matchesYear;
  });

  return (
    <div className={styles.tableCard}>
      {/* Search & Filter Bar matching exact screenshot */}
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

        {/* Year Filter Dropdown with Calendar Icon */}
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
            value={currentYear}
            onChange={(e) => handleYearChange(e.target.value)}
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
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Responsive Table matching screenshot */}
      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.monthHeader}>Month</th>
              <th className={styles.incomeHeader}>Total income</th>
              <th className={styles.taxHeader}>Total tax</th>
              <th className={styles.expenseHeader}>Expenses</th>
              <th className={styles.detailsHeader}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((item) => (
              <tr key={item.id} className={styles.tableRow}>
                {/* Month & Year */}
                <td className={styles.monthCell}>
                  <div className={styles.monthGroup}>
                    <span className={styles.monthName}>{item.month}</span>
                    <span className={styles.yearText}>{item.year}</span>
                  </div>
                </td>

                {/* Total Income */}
                <td className={styles.incomeCell}>
                  {formatETB(item.totalIncome)}
                </td>

                {/* Total Tax */}
                <td className={styles.taxCell}>
                  {formatETB(item.totalTax)}
                </td>

                {/* Expenses */}
                <td className={styles.expensesCell}>
                  {formatETB(item.expenses)}
                </td>

                {/* Action View Details Button */}
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
                      className={styles.eyeIcon}
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
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
                    : `No monthly transactions found for ${currentYear}.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;