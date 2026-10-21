import React from 'react';
import { UserCheck, Building2, FileText, AlertCircle } from 'lucide-react';
import { Badge } from './Badge';
import type { Tone, MerchantApplicationItem, TaxReportItem, AuditEventItem } from '../types';
import styles from './AdminOverview.module.css';

interface AdminOverviewProps {
  applications: MerchantApplicationItem[];
  reports: TaxReportItem[];
  auditEvents: AuditEventItem[];
  onReviewMerchant: (ref: string) => void;
  onReviewReport: (ref: string) => void;
  onNavigateToApprovals: () => void;
  onNavigateToReports: () => void;
  getToneForStatus: (status: string) => Tone;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  applications,
  reports,
  auditEvents,
  onReviewMerchant,
  onReviewReport,
  onNavigateToApprovals,
  onNavigateToReports,
  getToneForStatus,
}) => {
  const metricCards = [
    {
      label: 'Pending Merchant Applications',
      value: '12',
      detail: '4 received today',
      icon: UserCheck,
      bgColor: '#FFF7E6',
      iconColor: '#A85D08',
    },
    {
      label: 'Approved Merchants',
      value: '1,284',
      detail: '23 this month',
      icon: Building2,
      bgColor: '#E8F5EE',
      iconColor: '#176B4D',
    },
    {
      label: 'Pending Tax Reports',
      value: '18',
      detail: '6 nearing review target',
      icon: FileText,
      bgColor: '#EEF2FF',
      iconColor: '#4F46E5',
    },
    {
      label: 'Reports Requiring Information',
      value: '7',
      detail: 'Officer response required',
      icon: AlertCircle,
      bgColor: '#FEF2F2',
      iconColor: '#B91C1C',
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
          {/* Pending Applications */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Pending Merchant Applications</h2>
                <p className={styles.cardSubtext}>Fictional prototype records requiring attention</p>
              </div>
              <button
                type="button"
                onClick={onNavigateToApprovals}
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
                    <th className={styles.th}>Merchant ID</th>
                    <th className={styles.th}>Category</th>
                    <th className={styles.th}>Applied</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th} style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 3).map((item) => (
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
                  ))}
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
                  {reports.slice(0, 3).map((item) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Aside: Recent Administrative Decisions */}
        <aside className={styles.asideCard}>
          <h2 className={styles.cardTitle}>Recent Administrative Decisions</h2>
          <div className={styles.asideList}>
            {auditEvents.slice(0, 4).map((event) => (
              <div key={`${event.timestamp}-${event.reference}`} className={styles.asideItem}>
                <p className={styles.asideAction}>{event.action}</p>
                <p className={styles.asideMeta}>{event.reference} · {event.officer}</p>
                <p className={styles.asideDate}>{event.timestamp}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminOverview;
