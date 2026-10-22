import React, { useState } from 'react';
import { Badge } from '../../components/Badge';
import styles from './SalesRecordsTable.module.css';

export const SalesRecordsTable: React.FC = () => {
  const [searchReceipt, setSearchReceipt] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const salesRows = [
    ['AM2081-REG01-2026-000194', '20 Oct 2026 · 16:01', 'ETB 1,895.20', 'ETB 1,648.00', 'ETB 247.20', 'Cleared'],
    ['AM2081-REG01-2026-000193', '20 Oct 2026 · 15:42', 'ETB 3,450.00', 'ETB 3,000.00', 'ETB 450.00', 'Cleared'],
    ['AM2081-REG01-2026-000192', '20 Oct 2026 · 14:18', 'ETB 875.50', 'ETB 761.30', 'ETB 114.20', 'Cleared'],
    ['AM2081-REG01-2026-000191', '20 Oct 2026 · 13:05', 'ETB 1,940.00', 'ETB 1,686.96', 'ETB 253.04', 'Credit note'],
  ];

  const filteredRows = salesRows.filter((r) =>
    searchReceipt.trim() === '' || r[0].toLowerCase().includes(searchReceipt.toLowerCase())
  );

  return (
    <div className={styles.tableCard}>
      <div className={styles.controlsRow}>
        <input
          className={styles.searchInput}
          placeholder="Search receipt number"
          value={searchReceipt}
          onChange={(e) => setSearchReceipt(e.target.value)}
        />
        <input
          type="date"
          className={styles.dateInput}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className={styles.dateInput}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {[
                'Receipt Number',
                'Transaction Date',
                'Total Sales',
                'Taxable Amount',
                'Tax Amount',
                'Receipt Status',
              ].map((item) => (
                <th key={item} className={styles.th}>
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) => (
                  <td
                    key={cell}
                    className={`${styles.td} ${
                      index > 1 && index < 5 ? styles.tdNumber : ''
                    }`}
                  >
                    {index === 5 ? (
                      <Badge tone={cell === 'Cleared' ? 'success' : 'pending'}>
                        {cell}
                      </Badge>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.noticeBar}>
        Historical receipts are read-only. Any permitted correction requires a documented reason
        and audit event.
      </div>
    </div>
  );
};

export default SalesRecordsTable;
