import React, { useState, useMemo } from 'react';
import { Search, Download, Eye, X } from 'lucide-react';
import styles from './TransactionsLedger.module.css';

interface MonthlyTransactionRecord {
  id: string;
  month: string;
  year: number;
  totalIncome: number;
  totalTax: number;
  expenses: number;
  invoicesCount: number;
  vatStandard: number;
  withholdingTax: number;
}

const SEED_RECORDS: MonthlyTransactionRecord[] = [
  {
    id: 'rec-2026-10',
    month: 'October',
    year: 2026,
    totalIncome: 1482500.0,
    totalTax: 193370.0,
    expenses: 826400.0,
    invoicesCount: 428,
    vatStandard: 168400.0,
    withholdingTax: 24970.0,
  },
  {
    id: 'rec-2026-09',
    month: 'September',
    year: 2026,
    totalIncome: 1368400.0,
    totalTax: 178487.0,
    expenses: 754300.0,
    invoicesCount: 395,
    vatStandard: 155400.0,
    withholdingTax: 23087.0,
  },
  {
    id: 'rec-2026-08',
    month: 'August',
    year: 2026,
    totalIncome: 1297800.0,
    totalTax: 169278.0,
    expenses: 708900.0,
    invoicesCount: 382,
    vatStandard: 147300.0,
    withholdingTax: 21978.0,
  },
  {
    id: 'rec-2026-07',
    month: 'July',
    year: 2026,
    totalIncome: 1245600.0,
    totalTax: 162469.0,
    expenses: 691200.0,
    invoicesCount: 366,
    vatStandard: 141400.0,
    withholdingTax: 21069.0,
  },
  {
    id: 'rec-2026-06',
    month: 'June',
    year: 2026,
    totalIncome: 1189900.0,
    totalTax: 155204.0,
    expenses: 663500.0,
    invoicesCount: 341,
    vatStandard: 135100.0,
    withholdingTax: 20104.0,
  },
  {
    id: 'rec-2026-05',
    month: 'May',
    year: 2026,
    totalIncome: 1120400.0,
    totalTax: 146140.0,
    expenses: 630200.0,
    invoicesCount: 320,
    vatStandard: 127200.0,
    withholdingTax: 18940.0,
  },
  {
    id: 'rec-2026-04',
    month: 'April',
    year: 2026,
    totalIncome: 1085000.0,
    totalTax: 141520.0,
    expenses: 610000.0,
    invoicesCount: 310,
    vatStandard: 123200.0,
    withholdingTax: 18320.0,
  },
  {
    id: 'rec-2026-03',
    month: 'March',
    year: 2026,
    totalIncome: 1040200.0,
    totalTax: 135680.0,
    expenses: 590100.0,
    invoicesCount: 298,
    vatStandard: 118100.0,
    withholdingTax: 17580.0,
  },
  {
    id: 'rec-2026-02',
    month: 'February',
    year: 2026,
    totalIncome: 995000.0,
    totalTax: 129780.0,
    expenses: 570400.0,
    invoicesCount: 284,
    vatStandard: 113000.0,
    withholdingTax: 16780.0,
  },
  {
    id: 'rec-2026-01',
    month: 'January',
    year: 2026,
    totalIncome: 960300.0,
    totalTax: 125250.0,
    expenses: 550000.0,
    invoicesCount: 275,
    vatStandard: 109100.0,
    withholdingTax: 16150.0,
  },
];

export const TransactionsLedger: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<MonthlyTransactionRecord | null>(null);

  const PAGE_SIZE = 5;

  const filteredRecords = useMemo(() => {
    return SEED_RECORDS.filter((rec) => {
      const matchYear = rec.year === selectedYear;
      const matchSearch = rec.month.toLowerCase().includes(searchTerm.trim().toLowerCase());
      return matchYear && matchSearch;
    });
  }, [searchTerm, selectedYear]);

  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE) || 1;
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredRecords.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredRecords, currentPage]);

  const formatCurrency = (val: number) => {
    return `ETB ${val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleExportReport = () => {
    const headers = ['Month', 'Year', 'Total Income (ETB)', 'Total Tax (ETB)', 'Expenses (ETB)', 'Invoices Count'];
    const rows = filteredRecords.map((r) => [
      r.month,
      r.year,
      r.totalIncome.toFixed(2),
      r.totalTax.toFixed(2),
      r.expenses.toFixed(2),
      r.invoicesCount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `monthly-transactions-${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Transactions</h1>
          <p className={styles.subtitle}>
            Review monthly income, tax, expenses from cleared fiscal records.
          </p>
        </div>

        <button type="button" className={styles.exportBtn} onClick={handleExportReport}>
          <Download size={15} />
          <span>Export monthly report</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className={styles.card}>
        {/* Filters */}
        <div className={styles.filterRow}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={16} />
            <input
              type="text"
              placeholder="Search month"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.yearSelectWrapper}>
            <select
              className={styles.yearSelect}
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={2026}>📅 2026</option>
              <option value={2025}>📅 2025</option>
              <option value={2024}>📅 2024</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Total income</th>
                <th>Total tax</th>
                <th>Expenses</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.monthCell}>
                        <span className={styles.monthName}>{item.month}</span>
                        <span className={styles.yearLabel}>{item.year}</span>
                      </div>
                    </td>
                    <td className={styles.amountCell}>{formatCurrency(item.totalIncome)}</td>
                    <td className={styles.amountCell}>{formatCurrency(item.totalTax)}</td>
                    <td className={styles.amountCell}>{formatCurrency(item.expenses)}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.viewBtn}
                        onClick={() => setSelectedRecord(item)}
                      >
                        <Eye size={14} />
                        <span>View details</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                    No transaction records found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={styles.paginationBar}>
          <span className={styles.pageCount}>
            Page {currentPage} of {totalPages} · {filteredRecords.length} months
          </span>

          <div className={styles.pageActions}>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedRecord(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {selectedRecord.month} {selectedRecord.year} Fiscal Breakdown
              </h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setSelectedRecord(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.breakdownGrid}>
              <div className={styles.statTile}>
                <p className={styles.statTileLabel}>Total Cleared Sales</p>
                <p className={styles.statTileVal}>{formatCurrency(selectedRecord.totalIncome)}</p>
              </div>

              <div className={styles.statTile}>
                <p className={styles.statTileLabel}>Standard VAT (15%)</p>
                <p className={styles.statTileVal}>{formatCurrency(selectedRecord.vatStandard)}</p>
              </div>

              <div className={styles.statTile}>
                <p className={styles.statTileLabel}>Withholding Tax (2%)</p>
                <p className={styles.statTileVal}>{formatCurrency(selectedRecord.withholdingTax)}</p>
              </div>

              <div className={styles.statTile}>
                <p className={styles.statTileLabel}>Audited Fiscal Invoices</p>
                <p className={styles.statTileVal}>{selectedRecord.invoicesCount} cleared</p>
              </div>
            </div>

            <button
              type="button"
              className={styles.closeModalBtn}
              onClick={() => setSelectedRecord(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsLedger;
