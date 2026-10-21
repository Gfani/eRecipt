import React, { useState } from 'react';
import { Eye, FileCheck, X, Check, AlertCircle } from 'lucide-react';
import type { MerchantApplication } from '../types/approvalsTypes';
import styles from './ApprovalsTable.module.css';

interface ApprovalsTableProps {
  applications: MerchantApplication[];
  onApprove: (id: string) => void;
  onRequestClarification: (id: string) => void;
  onReject: (id: string) => void;
}

export const ApprovalsTable: React.FC<ApprovalsTableProps> = ({
  applications,
  onApprove,
  onRequestClarification,
  onReject,
}) => {
  const [selectedApp, setSelectedApp] = useState<MerchantApplication | null>(null);

  const getStatusBadge = (status: MerchantApplication['status']) => {
    switch (status) {
      case 'pending':
        return <span className={`${styles.badge} ${styles.statusPending}`}>Pending Clearance</span>;
      case 'action_required':
        return <span className={`${styles.badge} ${styles.statusActionRequired}`}>Action Required</span>;
      case 'approved':
        return <span className={`${styles.badge} ${styles.statusApproved}`}>Approved & Accredited</span>;
      case 'rejected':
        return <span className={`${styles.badge} ${styles.statusRejected}`}>Rejected</span>;
    }
  };

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Business & Trade Name</th>
              <th className={styles.th}>TIN</th>
              <th className={styles.th}>Tax Category</th>
              <th className={styles.th}>Location</th>
              <th className={styles.th}>Submitted</th>
              <th className={styles.th}>Documents</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  No merchant applications matching the selected criteria.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.businessCell}>
                      <span className={styles.businessName}>{app.businessName}</span>
                      <span className={styles.tradeName}>{app.tradeName}</span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.tinCode}>{app.tin}</span>
                  </td>
                  <td className={styles.td}>
                    <span>{app.taxCategory}</span>
                  </td>
                  <td className={styles.td}>
                    <span>{app.city}, {app.subCity}</span>
                  </td>
                  <td className={styles.td}>
                    <span>{app.submissionDate}</span>
                  </td>
                  <td className={styles.td}>
                    <span>{app.documents.length} verified docs</span>
                  </td>
                  <td className={styles.td}>
                    {getStatusBadge(app.status)}
                  </td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className={styles.reviewBtn}
                      onClick={() => setSelectedApp(app)}
                    >
                      <Eye size={14} />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Interactive Review Modal */}
      {selectedApp && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedApp(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Application Verification</h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Reference TIN: {selectedApp.tin}
                </span>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setSelectedApp(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Applicant & Business Details */}
              <div className={styles.sectionBox}>
                <h4 className={styles.sectionTitle}>Business & Tax Identity</h4>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <label>Legal Business Name</label>
                    <span>{selectedApp.businessName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Trade Name</label>
                    <span>{selectedApp.tradeName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Tax Identification Number (TIN)</label>
                    <span style={{ fontFamily: 'monospace' }}>{selectedApp.tin}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Tax Category</label>
                    <span>{selectedApp.taxCategory}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Principal Applicant</label>
                    <span>{selectedApp.applicantName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Phone Contact</label>
                    <span>{selectedApp.phone}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Physical Address</label>
                    <span>{selectedApp.city}, {selectedApp.subCity}, {selectedApp.building}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Current Status</label>
                    <span>{getStatusBadge(selectedApp.status)}</span>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className={styles.sectionBox}>
                <h4 className={styles.sectionTitle}>Uploaded Documentation</h4>
                {selectedApp.documents.map((doc, idx) => (
                  <div key={idx} className={styles.docItem}>
                    <div className={styles.docName}>
                      <FileCheck size={16} style={{ color: '#0D9488' }} />
                      <span>{doc.name}</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>({doc.size})</span>
                    </div>
                    <span className={styles.docVerified}>Tax Clearance Match</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setSelectedApp(null)}
              >
                Close
              </button>

              {selectedApp.status !== 'rejected' && (
                <button
                  type="button"
                  className={styles.btnDanger}
                  onClick={() => {
                    onReject(selectedApp.id);
                    setSelectedApp(null);
                  }}
                >
                  Reject Application
                </button>
              )}

              {selectedApp.status !== 'action_required' && selectedApp.status !== 'approved' && (
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => {
                    onRequestClarification(selectedApp.id);
                    setSelectedApp(null);
                  }}
                >
                  <AlertCircle size={14} style={{ marginRight: '6px' }} />
                  Request Clarification
                </button>
              )}

              {selectedApp.status !== 'approved' && (
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={() => {
                    onApprove(selectedApp.id);
                    setSelectedApp(null);
                  }}
                >
                  <Check size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Approve & Issue Accreditation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsTable;
