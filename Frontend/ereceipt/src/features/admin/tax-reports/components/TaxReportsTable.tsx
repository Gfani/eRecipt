import React, { useState } from 'react';
import { Badge } from '../../components/Badge';
import type { TaxReportItem, Tone } from '../../types';
import styles from './TaxReportsTable.module.css';

interface TaxReportsTableProps {
  reports: TaxReportItem[];
  onReviewReport: (ref: string) => void;
  getToneForStatus: (status: string) => Tone;
}

export const TaxReportsTable: React.FC<TaxReportsTableProps> = ({
  reports,
  onReviewReport,
  getToneForStatus,
}) => {
  const [filterTab, setFilterTab] = useState('All Reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('All tax periods');
  const [categoryFilter, setCategoryFilter] = useState('All classifications');
  const [dateFilter, setDateFilter] = useState('');

  const filterTabs = [
    'All Reports',
    'Pending Review',
    'Under Review',
    'Approved',
    'Rejected',
    'Additional Information Required',
  ];

  const filteredReports = reports.filter((item) => {
    const matchesTab = filterTab === 'All Reports' || item.status === filterTab;
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tin.includes(searchQuery.trim()) ||
      item.ref.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPeriod =
      periodFilter === 'All tax periods' || item.period === periodFilter;
    const matchesCategory =
      categoryFilter === 'All classifications' || item.category === categoryFilter;
    return matchesTab && matchesQuery && matchesPeriod && matchesCategory;
  });

  return (
    <div>
      <div className={styles.tabList}>
        {filterTabs.map((tab) => {
          const isActive = filterTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterTab(tab)}
              className={`${styles.tabButton} ${
                isActive ? styles.tabButtonActive : styles.tabButtonInactive
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className={styles.filterGrid}>
        <input
          className={styles.field}
          placeholder="Search TIN, merchant, or report"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className={styles.field}
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
        >
          <option>All tax periods</option>
          <option>September 2026</option>
          <option>Q3 2026</option>
        </select>
        <select
          className={styles.field}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>All classifications</option>
          <option>VAT</option>
          <option>TOT</option>
        </select>
        <input
          type="date"
          className={styles.field}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Report Reference</th>
              <th className={styles.th}>Merchant</th>
              <th className={styles.th}>TIN</th>
              <th className={styles.th}>Tax Period</th>
              <th className={styles.th}>Classification</th>
              <th className={styles.th}>Declared Sales</th>
              <th className={styles.th}>Reported Tax</th>
              <th className={styles.th}>Submitted</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((item) => (
              <tr key={item.ref}>
                <td className={`${styles.td} ${styles.tdRef}`}>{item.ref}</td>
                <td className={`${styles.td} ${styles.tdMerchant}`}>{item.name}</td>
                <td className={styles.td}>{item.tin}</td>
                <td className={styles.td}>{item.period}</td>
                <td className={styles.td}>{item.category}</td>
                <td className={`${styles.td} ${styles.tdNumber}`}>
                  ETB {item.sales.toLocaleString()}
                </td>
                <td className={`${styles.td} ${styles.tdNumber}`}>
                  ETB {item.tax.toLocaleString()}
                </td>
                <td className={styles.td}>{item.date}</td>
                <td className={styles.td}>
                  <Badge tone={getToneForStatus(item.status)}>{item.status}</Badge>
                </td>
                <td className={styles.td} style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => onReviewReport(item.ref)}
                    className={styles.reviewBtn}
                  >
                    Review
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
