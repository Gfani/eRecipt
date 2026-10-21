import React, { useState } from 'react';
import type { AuditEventItem } from '../../types';
import styles from './AdminAuditLogTable.module.css';

interface AdminAuditLogTableProps {
  auditEvents?: AuditEventItem[];
}

const defaultEvents: AuditEventItem[] = [
  {
    timestamp: '20 Oct 2026 · 16:22',
    officer: 'Hana Alemu · RO-218',
    action: 'Merchant application reviewed',
    reference: 'APP-2026-0147',
    statusTransition: 'Pending → Under Review',
    notes: 'Document review initiated',
  },
  {
    timestamp: '20 Oct 2026 · 15:48',
    officer: 'Bekele Tadesse · RO-184',
    action: 'Tax report approved',
    reference: 'TR-2026-0909',
    statusTransition: 'Under Review → Approved',
    notes: 'Reconciliation within accepted variance',
  },
  {
    timestamp: '20 Oct 2026 · 14:31',
    officer: 'Hana Alemu · RO-218',
    action: 'Additional information requested',
    reference: 'APP-2026-0145',
    statusTransition: 'Under Review → More Information',
    notes: 'Updated trade licence requested',
  },
  {
    timestamp: '20 Oct 2026 · 12:06',
    officer: 'Meron Girma · RO-203',
    action: 'Receipt authorization changed',
    reference: 'MER-10473',
    statusTransition: 'Authorized → Suspended',
    notes: 'Administrative review reference AR-1108',
  },
];

export const AdminAuditLogTable: React.FC<AdminAuditLogTableProps> = ({
  auditEvents = defaultEvents,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('All actions');
  const [dateFilter, setDateFilter] = useState('');

  const filteredEvents = auditEvents.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.officer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction =
      actionFilter === 'All actions' || item.action.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  return (
    <div className={styles.card}>
      <div className={styles.filtersRow}>
        <input
          className={styles.field}
          placeholder="Search officer, action, or reference"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className={styles.field}
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option>All actions</option>
          <option>Merchant decisions</option>
          <option>Tax report decisions</option>
          <option>Authorization changes</option>
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
              {[
                'Date & Time',
                'Officer',
                'Action',
                'Reference',
                'Previous → New Status',
                'Reason / Note',
              ].map((item) => (
                <th key={item} className={styles.th}>
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((row) => (
              <tr key={`${row.timestamp}-${row.reference}`}>
                <td className={styles.td}>{row.timestamp}</td>
                <td className={styles.td}>{row.officer}</td>
                <td className={styles.td}>{row.action}</td>
                <td className={`${styles.td} ${styles.tdRef}`}>{row.reference}</td>
                <td className={styles.td}>{row.statusTransition}</td>
                <td className={styles.td}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.noticeBar}>
        Administrative audit entries are append-only in this prototype and cannot be edited from
        the interface.
      </div>
    </div>
  );
};

export default AdminAuditLogTable;
