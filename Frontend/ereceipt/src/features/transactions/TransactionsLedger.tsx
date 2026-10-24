import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Eye, X, FileText, PlusCircle } from 'lucide-react';
import { getStoredMerchantProfile } from '../merchant-registration';
import {
  getMerchantMonthlyLedger,
  type MonthlyLedgerRecord,
} from '../../services/merchantDataStore';
import styles from './TransactionsLedger.module.css';

interface TransactionsLedgerProps {
  onNavigate?: (screen: string) => void;
}

export const TransactionsLedger: React.FC<TransactionsLedgerProps> = ({ onNavigate }) => {
  const profile = getStoredMerchantProfile();
  const merchantTin = profile.tin || '0987654321';
  const businessName = profile.tradeName || profile.sellerLegalName || 'Registered Merchant';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<MonthlyLedgerRecord | null>(null);

  const [ledgerRecords, setLedgerRecords] = useState<MonthlyLedgerRecord[]>(() =>
    getMerchantMonthlyLedger(merchantTin, selectedYear)
  );

  useEffect(() => {
    const refresh = () => {
      setLedgerRecords(getMerchantMonthlyLedger(merchantTin, selectedYear));
    };
    refresh();
    window.addEventListener('ereceipt:receipts_updated', refresh);
    return () => window.removeEventListener('ereceipt:receipts_updated', refresh);
  }, [merchantTin, selectedYear]);

  const PAGE_SIZE = 5;

  const filteredRecords = useMemo(() => {
    return ledgerRecords.filter((rec) => {
      const matchYear = rec.year === selectedYear;
      const matchSearch = rec.month.toLowerCase().includes(searchTerm.trim().toLowerCase());
      return matchYear && matchSearch;
    });
  }, [ledgerRecords, searchTerm, selectedYear]);

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
    link.setAttribute('download', `transactions-${merchantTin}-${selectedYear}.csv`);
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
            Review monthly income, tax, and expenses from cleared fiscal records for {businessName}.
          </p>
        </div>

        {filteredRecords.length > 0 && (
          <button type="button" className={styles.exportBtn} onClick={handleExportReport}>
            <Download size={15} />
            <span>Export monthly report</span>
          </button>
        )}
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

        {/* Table or Empty State */}
        {filteredRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <FileText size={44} style={{ color: '#0b8060', margin: '0 auto 12px auto', display: 'block' }} />
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 600, color: '#17201B' }}>
              No transactions recorded for {selectedYear}
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#526059', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
              No cleared receipts have been issued yet under TIN {merchantTin}.
              Issue a receipt via POS to see real sales transactions recorded here.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate?.('pos')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <PlusCircle size={16} />
              <span>Issue a Receipt</span>
            </button>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Income</th>
                  <th>Total Tax</th>
                  <th>Expenses</th>
                  <th style={{ textAlign: 'center' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <span className={styles.monthName}>{record.month}</span>
                      <span className={styles.monthYear}>{record.year}</span>
                    </td>
                    <td className={styles.amountIncome}>{formatCurrency(record.totalIncome)}</td>
                    <td className={styles.amountTax}>{formatCurrency(record.totalTax)}</td>
                    <td className={styles.amountExpenses}>{formatCurrency(record.expenses)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className={styles.viewDetailsBtn}
                        onClick={() => setSelectedRecord(record)}
                      >
                        <Eye size={14} />
                        <span>View details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredRecords.length > 0 && (
          <div className={styles.paginationBar}>
            <span className={styles.pageCount}>
              Page {currentPage} of {totalPages} · {filteredRecords.length} month{filteredRecords.length > 1 ? 's' : ''}
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
        )}
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

            {/* Issued receipts list in this month */}
            {selectedRecord.receipts && selectedRecord.receipts.length > 0 && (
              <div style={{ marginTop: '16px', maxHeight: '200px', overflowY: 'auto' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 700, color: '#17201B', textTransform: 'uppercase' }}>
                  Cleared Receipts for this period
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedRecord.receipts.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#F8FAF9',
                        borderRadius: '6px',
                        border: '1px solid #E2E8E4',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px',
                      }}
                    >
                      <div>
                        <strong>{r.receiptNumber}</strong> · {r.customerName}
                        <div style={{ color: '#526059', fontSize: '11px', marginTop: '2px' }}>
                          {r.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#0b8060' }}>{formatCurrency(r.total)}</strong>
                        <div style={{ color: '#8B9E94', fontSize: '10px' }}>
                          VAT: {formatCurrency(r.tax)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className={styles.closeModalBtn}
              onClick={() => setSelectedRecord(null)}
              style={{ marginTop: '20px' }}
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
