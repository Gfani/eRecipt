import React from 'react';
import { UserCheck, Building2, ReceiptText, FileText } from 'lucide-react';
import { Badge } from './Badge';
import type { Tone, MerchantApplicationItem, TaxReportItem, AuditEventItem } from '../types';
import styles from './AdminOverview.module.css';

interface AdminOverviewProps {
  applications: MerchantApplicationItem[];
  reports: TaxReportItem[];
  auditEvents: AuditEventItem[];
  receipts?: any[];
  onReviewMerchant: (ref: string) => void;
  onReviewReport: (ref: string) => void;
  onNavigateToApprovals: () => void;
  onNavigateToReports: () => void;
  onNavigateToSales?: () => void;
  getToneForStatus: (status: string) => Tone;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  applications,
  reports,
  auditEvents,
  receipts = [],
  onReviewMerchant,
  onReviewReport,
  onNavigateToApprovals,
  onNavigateToReports,
  onNavigateToSales,
  getToneForStatus,
}) => {
  const pendingCount = applications.filter(
    (a) => a.status === 'Pending' || a.status === 'Under Review'
  ).length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;

  const totalReceiptsIssued = receipts.length;
  const liveClearedSales = receipts.reduce((acc, r) => acc + (r.total || 0), 0);
  const totalLedgerSales = liveClearedSales;

  const metricCards = [
    {
      label: 'Pending Merchant Applications',
      value: String(pendingCount),
      detail: `${pendingCount} awaiting compliance review`,
      icon: UserCheck,
      bgColor: '#FFF7E6',
      iconColor: '#A85D08',
    },
    {
      label: 'Approved Taxpayers',
      value: String(approvedCount),
      detail: 'Accredited in merchant registry',
      icon: Building2,
      bgColor: '#E8F5EE',
      iconColor: '#176B4D',
    },
    {
      label: 'Cleared Fiscal Receipts',
      value: String(totalReceiptsIssued),
      detail: `${totalReceiptsIssued} live POS receipt(s) cleared`,
      icon: ReceiptText,
      bgColor: '#EEF2FF',
      iconColor: '#4F46E5',
    },
    {
      label: 'Recorded Sales Volume',
      value: `ETB ${totalLedgerSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      detail: 'MoR certified sales & VAT ledger',
      icon: FileText,
      bgColor: '#ECFDF5',
      iconColor: '#059669',
    },
  ];

  return (
    <div className={styles.container}>
      {/* 4 Metric Cards */}
      <div className={styles.metricsGrid}>
        {metricCards.map((m) => {
          const IconComponent = m.icon;
          return (
            <div key={m.label} className={styles.metricCard}>
              <div className={styles.metricTop}>
                <p className={styles.metricLabel}>{m.label}</p>
                <span
                  className={styles.metricIconBox}
                  style={{ backgroundColor: m.bgColor, color: m.iconColor }}
                >
                  <IconComponent size={18} />
                </span>
              </div>
              <p className={styles.metricValue}>{m.value}</p>
              <p className={styles.metricDetail}>{m.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Main Split Content */}
      <div className={styles.splitGrid}>
        <div className={styles.leftCol}>
          {/* Applications Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>
                  {pendingCount > 0 ? 'Pending Merchant Applications' : 'Merchant Registration Applications'}
                </h2>
                <p className={styles.cardSubtext}>
                  {pendingCount > 0
                    ? `${pendingCount} new merchant registration(s) awaiting compliance review`
                    : 'Latest registered business profiles and accreditation status'}
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToApprovals}
                className={styles.viewAllBtn}
              >
                View all in Approvals
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Merchant</th>
                    <th className={styles.th}>TIN</th>
                    <th className={styles.th}>Merchant ID</th>
                    <th className={styles.th}>Category</th>
                    <th className={styles.th}>Applied</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th} style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '28px 16px', color: '#667069' }}>
                        No merchant applications recorded yet.
                      </td>
                    </tr>
                  ) : (
                    applications.slice(0, 4).map((item) => (
                      <tr key={item.ref}>
                        <td className={`${styles.td} ${styles.tdMerchant}`}>{item.name}</td>
                        <td className={styles.td}>{item.tin}</td>
                        <td className={styles.td}>{item.merchantId}</td>
                        <td className={styles.td}>{item.category}</td>
                        <td className={styles.td}>{item.date}</td>
                        <td className={styles.td}>
                          <Badge tone={getToneForStatus(item.status)}>{item.status}</Badge>
                        </td>
                        <td className={styles.td} style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => onReviewMerchant(item.ref)}
                            className={styles.reviewBtn}
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Cleared Fiscal Receipts (MoR EIMS) */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Live Cleared Fiscal Receipts (MoR EIMS)</h2>
                <p className={styles.cardSubtext}>
                  Real-time sales receipts issued from merchant POS and certified by MoR fiscal system
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToSales}
                className={styles.viewAllBtn}
              >
                View Sales Ledger
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Receipt # / IRN</th>
                    <th className={styles.th}>Customer</th>
                    <th className={styles.th}>Date & Time</th>
                    <th className={styles.th}>Total (ETB)</th>
                    <th className={styles.th}>VAT (ETB)</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th} style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '28px 16px', color: '#667069' }}>
                        No live receipts issued yet. When a receipt is cleared in the POS, it will automatically appear here.
                      </td>
                    </tr>
                  ) : (
                    receipts.slice(0, 5).map((r: any) => {
                      const recNum = r.receiptNumber || r.irn || 'REC-CLEARED';
                      const customer = r.customerName || 'Walk-in Customer';
                      const dateStr = r.clearanceTimestamp || r.createdAt
                        ? new Date(r.clearanceTimestamp || r.createdAt).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Just now';
                      const totalVal = (r.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                      const taxVal = (r.tax || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                      return (
                        <tr key={r.id || r.receiptNumber || r.irn || Math.random()}>
                          <td className={`${styles.td} ${styles.tdMerchant}`}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{recNum}</span>
                          </td>
                          <td className={styles.td}>{customer}</td>
                          <td className={styles.td}>{dateStr}</td>
                          <td className={styles.td} style={{ fontWeight: 600, color: '#17201B' }}>ETB {totalVal}</td>
                          <td className={styles.td}>ETB {taxVal}</td>
                          <td className={styles.td}>
                            <Badge tone="success">{r.status || 'Cleared'}</Badge>
                          </td>
                          <td className={styles.td} style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={onNavigateToSales}
                              className={styles.reviewBtn}
                            >
                              Ledger
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Tax Report Submissions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recent Tax Report Submissions</h2>
              <button
                type="button"
                onClick={onNavigateToReports}
                className={styles.viewAllBtn}
              >
                View all
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Merchant</th>
                    <th className={styles.th}>TIN</th>
                    <th className={styles.th}>Period</th>
                    <th className={styles.th}>Category</th>
                    <th className={styles.th}>Submitted</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th} style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '28px 16px', color: '#667069' }}>
                        No tax report submissions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    reports.slice(0, 3).map((item) => (
                      <tr key={item.ref}>
                        <td className={`${styles.td} ${styles.tdMerchant}`}>{item.name}</td>
                        <td className={styles.td}>{item.tin}</td>
                        <td className={styles.td}>{item.period}</td>
                        <td className={styles.td}>{item.category}</td>
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
                            Review Report
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Aside: Recent Administrative Decisions */}
        <aside className={styles.asideCard}>
          <h2 className={styles.cardTitle}>Recent Administrative Decisions</h2>
          <div className={styles.asideList}>
            {auditEvents.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#667069', padding: '16px 0', margin: 0 }}>
                No administrative decisions logged yet. Decisions made by officers will record here in real-time.
              </p>
            ) : (
              auditEvents.slice(0, 4).map((event) => (
                <div key={`${event.timestamp}-${event.reference}`} className={styles.asideItem}>
                  <p className={styles.asideAction}>{event.action}</p>
                  <p className={styles.asideMeta}>{event.reference} · {event.officer}</p>
                  <p className={styles.asideDate}>{event.timestamp}</p>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminOverview;
