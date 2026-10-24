import React, { useState } from 'react';
import type { AuditEventItem } from '../types';
import styles from './AdminAuditLog.module.css';

interface AdminAuditLogProps {
  auditEvents: AuditEventItem[];
}

export const AdminAuditLog: React.FC<AdminAuditLogProps> = ({ auditEvents }) => {
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
      {/* Filters */}
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

      {/* Table */}
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
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                  No administrative audit records logged yet. System operations will appear here dynamically.
                </td>
              </tr>
            ) : (
              filteredEvents.map((row) => (
                <tr key={`${row.timestamp}-${row.reference}`}>
                  <td className={styles.td}>{row.timestamp}</td>
                  <td className={styles.td}>{row.officer}</td>
                  <td className={styles.td}>{row.action}</td>
                  <td className={`${styles.td} ${styles.tdRef}`}>{row.reference}</td>
                  <td className={styles.td}>{row.statusTransition}</td>
                  <td className={styles.td}>{row.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.noticeBar}>
        Administrative audit entries are append-only and cryptographically secured.
      </div>
    </div>
  );
};

export default AdminAuditLog;
