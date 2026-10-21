import React, { useState } from 'react';
import { Badge } from './Badge';
import type { Tone } from '../types';
import styles from './TaxRecordsLedger.module.css';

interface TaxRecordsLedgerProps {
  onSelectMerchant: (merchantName: string) => void;
  getToneForStatus: (status: string) => Tone;
}

export const TaxRecordsLedger: React.FC<TaxRecordsLedgerProps> = ({
  onSelectMerchant,
  getToneForStatus,
}) => {
  const [searchTin, setSearchTin] = useState('');
  const [searchMerchant, setSearchMerchant] = useState('');
  const [periodFilter, setPeriodFilter] = useState('All tax periods');
  const [statusFilter, setStatusFilter] = useState('All record statuses');

  const taxRecords = [
    ['September 2026', 'Lomi Café and Bakery', 'VAT', 'TR-2026-0918', 'ETB 1,482,500.00', 'ETB 193,370.00', '—', 'ETB 0.00', 'ETB 193,370.00', 'Report Pending Review'],
    ['September 2026', 'Abyssinia Textiles PLC', 'VAT', 'TR-2026-0909', 'ETB 4,187,600.00', 'ETB 546,209.00', 'ETB 548,100.00', 'ETB 300,000.00', 'ETB 248,100.00', 'Partially Paid'],
    ['Q3 2026', 'Blue Nile Stationery', 'TOT', 'TR-2026-0898', 'ETB 624,800.00', 'ETB 12,496.00', 'ETB 12,496.00', 'ETB 12,496.00', 'ETB 0.00', 'Paid'],
    ['August 2026', 'Desta Pharmacy', 'VAT', 'TR-2026-0812', 'ETB 2,104,300.00', 'ETB 274,474.00', 'ETB 276,200.00', 'ETB 0.00', 'ETB 276,200.00', 'Tax Assessed'],
  ];

  const filteredRecords = taxRecords.filter((row) => {
    const matchesTin = searchTin.trim() === '' || row[3].toLowerCase().includes(searchTin.toLowerCase());
    const matchesMerchant = searchMerchant.trim() === '' || row[1].toLowerCase().includes(searchMerchant.toLowerCase());
    const matchesPeriod = periodFilter === 'All tax periods' || row[0] === periodFilter;
    const matchesStatus = statusFilter === 'All record statuses' || row[9] === statusFilter;
    return matchesTin && matchesMerchant && matchesPeriod && matchesStatus;
  });

  return (
    <div className={styles.card}>
      {/* Filters */}
      <div className={styles.filtersRow}>
        <input
          className={styles.field}
          placeholder="Search by TIN or Ref"
          value={searchTin}
          onChange={(e) => setSearchTin(e.target.value)}
        />
        <input
          className={styles.field}
          placeholder="Search merchant name"
          value={searchMerchant}
          onChange={(e) => setSearchMerchant(e.target.value)}
        />
        <select
          className={styles.field}
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
        >
          <option>All tax periods</option>
          <option>September 2026</option>
          <option>Q3 2026</option>
          <option>August 2026</option>
        </select>
        <select
          className={styles.field}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All record statuses</option>
          <option>Report Pending Review</option>
          <option>Tax Assessed</option>
          <option>Partially Paid</option>
          <option>Paid</option>
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {[
                'Tax Period',
                'Merchant',
                'Classification',
                'Report Reference',
                'Declared Amount',
                'Reported Tax',
                'Assessed Amount',
                'Recorded Payment',
                'Outstanding',
                'Status',
              ].map((item) => (
                <th key={item} className={styles.th}>
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((row) => (
              <tr key={`${row[0]}-${row[1]}`}>
                {row.map((cell, index) => (
                  <td key={`${cell}-${index}`} className={styles.td}>
                    {index === 1 ? (
                      <button
                        type="button"
                        onClick={() => onSelectMerchant(cell)}
                        className={styles.merchantBtn}
                      >
                        {cell}
                      </button>
                    ) : index === 9 ? (
                      <Badge tone={getToneForStatus(cell)}>{cell}</Badge>
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
        Report approval, official assessment, and payment are separate events. Amounts shown as
        assessed or paid must be supported by authoritative records.
      </div>
    </div>
  );
};

export default TaxRecordsLedger;
