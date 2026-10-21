import React from 'react';
import { CalendarDays } from 'lucide-react';
import type { MonthlyFinancialRecord } from '../types';
import styles from './MonthlyRecordsTable.module.css';

interface MonthlyRecordsTableProps {
  records: MonthlyFinancialRecord[];
  startDate: string;
  endDate: string;
}

export const MonthlyRecordsTable: React.FC<MonthlyRecordsTableProps> = ({
  records,
  startDate,
  endDate,
}) => {
  const money = (val: number) =>
    val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <h2 className={styles.title}>Monthly financial records</h2>
        <p className={styles.subtitle}>
          Records between {startDate} and {endDate}
        </p>
      </div>

      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Tax</th>
            </tr>
          </thead>
          <tbody>
            {records.map((row) => (
              <tr key={row.key}>
                <td className={styles.monthCell}>{row.month}</td>
                <td className={styles.amountCell}>ETB {money(row.income)}</td>
                <td className={styles.expenseCell}>ETB {money(row.expenses)}</td>
                <td className={styles.taxCell}>ETB {money(row.tax)}</td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <div className={styles.emptyState}>
                    <CalendarDays size={32} className={styles.emptyIcon} />
                    <p className={styles.emptyTitle}>No monthly records in this date range</p>
                    <p className={styles.emptyCopy}>Choose a different start and end date.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyRecordsTable;
