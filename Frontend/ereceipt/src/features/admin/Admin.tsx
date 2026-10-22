import React, { useState, useEffect } from 'react';
import { Badge } from './components/Badge';
import { DecisionModal } from './components/DecisionModal';
import { OfficerSignIn } from './components/OfficerSignIn';
import { AdminSidebar } from '../../layouts/AdminLayout/components/AdminSidebar';
import { AdminTopbar } from '../../layouts/AdminLayout/components/AdminTopbar';
import { AdminOverview } from './components/AdminOverview';
import { MerchantApprovals } from './components/MerchantApprovals';
import { MerchantReview } from './components/MerchantReview';
import { MerchantDirectory } from './components/MerchantDirectory';
import { MerchantDetails } from './components/MerchantDetails';
import { SalesRecords } from './components/SalesRecords';
import { TaxReports } from './components/TaxReports';
import { TaxReportReview } from './components/TaxReportReview';
import { TaxRecordsLedger } from './components/TaxRecordsLedger';
import { AdminAuditLog } from './components/AdminAuditLog';
import { AdminSettings } from './components/AdminSettings';

import type {
  AdminPage,
  Decision,
  Tone,
  MerchantApplicationItem,
  TaxReportItem,
  DirectoryMerchantItem,
  AuditEventItem,
} from './types';

import styles from './Admin.module.css';

interface AdminProps {
  onReturnToMerchant?: (screen?: string) => void;
}

export const Admin: React.FC<AdminProps> = ({ onReturnToMerchant }) => {
  const [signedIn, setSignedIn] = useState(true);
  const [page, setPage] = useState<AdminPage>('overview');
  const [globalSearch, setGlobalSearch] = useState('');
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryQuery, setDirectoryQuery] = useState('');

  const [decision, setDecision] = useState<Decision | null>(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [selectedMerchantRef, setSelectedMerchantRef] = useState('APP-2026-0148');
  const [selectedReportRef, setSelectedReportRef] = useState('TR-2026-0918');

  // Synchronize applications and directory from backend on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/admin/merchants/applications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setApplications(data.data);
        }
      })
      .catch(() => {});

    fetch('http://localhost:5000/api/admin/merchants/directory')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setMerchants(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const [applications, setApplications] = useState<MerchantApplicationItem[]>([
    {
      ref: 'APP-2026-0148',
      name: 'Meklit Home Goods PLC',
      tin: '0012847391',
      merchantId: 'MER-10482',
      category: 'Retail',
      date: '18 Oct 2026',
      status: 'Pending',
      address: 'Addis Ababa, Lideta Sub-city',
    },
    {
      ref: 'APP-2026-0147',
      name: 'Desta Pharmacy',
      tin: '0017932054',
      merchantId: 'MER-10481',
      category: 'Pharmacy',
      date: '18 Oct 2026',
      status: 'Under Review',
      address: 'Adama, Bole Sub-city',
    },
    {
      ref: 'APP-2026-0145',
      name: 'Blue Nile Stationery',
      tin: '0014638290',
      merchantId: 'MER-10479',
      category: 'Wholesale',
      date: '17 Oct 2026',
      status: 'Additional Information Required',
      address: 'Bahir Dar, Belay Zeleke Sub-city',
    },
    {
      ref: 'APP-2026-0142',
      name: 'Lomi Café and Bakery',
      tin: '0019274635',
      merchantId: 'MER-10476',
      category: 'Hospitality',
      date: '16 Oct 2026',
      status: 'Approved',
      address: 'Addis Ababa, Bole Sub-city',
    },
    {
      ref: 'APP-2026-0139',
      name: 'Walia Auto Parts',
      tin: '0016528347',
      merchantId: 'MER-10473',
      category: 'Automotive',
      date: '15 Oct 2026',
      status: 'Rejected',
      address: 'Hawassa, Tabor Sub-city',
    },
  ]);

  const [reports, setReports] = useState<TaxReportItem[]>([
    {
      ref: 'TR-2026-0918',
      name: 'Lomi Café and Bakery',
      tin: '0019274635',
      period: 'September 2026',
      category: 'VAT',
      sales: 1482500,
      tax: 193370,
      date: '18 Oct 2026',
      status: 'Pending Review',
    },
    {
      ref: 'TR-2026-0917',
      name: 'Addis Medical Supplies',
      tin: '0013847295',
      period: 'September 2026',
      category: 'VAT',
      sales: 2834000,
      tax: 369652,
      date: '18 Oct 2026',
      status: 'Under Review',
    },
    {
      ref: 'TR-2026-0914',
      name: 'Selam Printing House',
      tin: '0015638204',
      period: 'Q3 2026',
      category: 'TOT',
      sales: 624800,
      tax: 12496,
      date: '17 Oct 2026',
      status: 'Additional Information Required',
    },
    {
      ref: 'TR-2026-0909',
      name: 'Abyssinia Textiles PLC',
      tin: '0018473620',
      period: 'September 2026',
      category: 'VAT',
      sales: 4187600,
      tax: 546209,
      date: '16 Oct 2026',
      status: 'Approved',
    },
    {
      ref: 'TR-2026-0905',
      name: 'Guzo Tour Services',
      tin: '0012746385',
      period: 'Q3 2026',
      category: 'TOT',
      sales: 891500,
      tax: 17830,
      date: '15 Oct 2026',
      status: 'Rejected',
    },
  ]);

  const [merchants, setMerchants] = useState<DirectoryMerchantItem[]>([
    {
      name: 'Lomi Café and Bakery',
      tin: '0019274635',
      id: 'MER-10476',
      category: 'Hospitality',
      classification: 'VAT',
      status: 'Approved',
      authorization: 'Authorized',
    },
    {
      name: 'Meklit Home Goods PLC',
      tin: '0012847391',
      id: 'MER-10482',
      category: 'Retail',
      classification: 'Needs Further Review',
      status: 'Pending',
      authorization: 'Not authorized',
    },
    {
      name: 'Desta Pharmacy',
      tin: '0017932054',
      id: 'MER-10481',
      category: 'Pharmacy',
      classification: 'VAT',
      status: 'Under Review',
      authorization: 'Not authorized',
    },
    {
      name: 'Blue Nile Stationery',
      tin: '0014638290',
      id: 'MER-10479',
      category: 'Wholesale',
      classification: 'TOT',
      status: 'Approved',
      authorization: 'Authorized',
    },
    {
      name: 'Walia Auto Parts',
      tin: '0016528347',
      id: 'MER-10473',
      category: 'Automotive',
      classification: 'VAT',
      status: 'Suspended',
      authorization: 'Suspended',
    },
  ]);

  const [auditEvents, setAuditEvents] = useState<AuditEventItem[]>([
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
  ]);

  const pageTitles: Record<AdminPage, string> = {
    overview: 'Overview',
    approvals: 'Merchant Approvals',
    merchantReview: 'Merchant Review',
    directory: 'Merchant Directory',
    merchantDetails: 'Merchant Details',
    sales: 'Sales Records',
    reports: 'Tax Reports',
    reportReview: 'Tax Report Review',
    taxRecords: 'Tax Records',
    audit: 'Audit Log',
    settings: 'Settings',
  };

  const getToneForStatus = (status: string): Tone => {
    if (
      status.includes('Approved') ||
      status === 'Authorized' ||
      status === 'Paid' ||
      status === 'Cleared'
    )
      return 'success';
    if (status.includes('Rejected') || status.includes('Suspended')) return 'error';
    if (
      status.includes('Review') ||
      status.includes('Pending') ||
      status.includes('Information')
    )
      return 'pending';
    return 'info';
  };

  const navigate = (target: string) => {
    setPage(target as AdminPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reviewMerchant = (ref: string) => {
    setSelectedMerchantRef(ref);
    setDecisionReason('');
    navigate('merchantReview');
  };

  const reviewReport = (ref: string) => {
    setSelectedReportRef(ref);
    setDecisionReason('');
    navigate('reportReview');
  };

  const selectedApplication =
    applications.find((item) => item.ref === selectedMerchantRef) ?? applications[0];

  const selectedReport =
    reports.find((item) => item.ref === selectedReportRef) ?? reports[0];

  const directoryResults = merchants.filter(
    (m) =>
      !directoryQuery ||
      `${m.tin} ${m.id} ${m.name}`.toLowerCase().includes(directoryQuery.toLowerCase())
  );

  const selectedDirectoryMerchant =
    merchants.find((m) => m.tin === directorySearch || m.id === directorySearch) ??
    merchants[0];

  const applyDecision = () => {
    if (!decision || (decision.kind !== 'approve' && !decisionReason.trim())) return;

    const nextStatus =
      decision.kind === 'approve'
        ? 'Approved'
        : decision.kind === 'request'
        ? 'Additional Information Required'
        : 'Rejected';

    const nowFormatted = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (decision.entity === 'merchant') {
      const previous = selectedApplication.status;

      // Post decision to live backend
      fetch(`http://localhost:5000/api/admin/merchants/applications/${selectedApplication.ref}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: decision.kind,
          reason: decisionReason || (decision.kind === 'approve' ? 'Verification checks completed' : 'Administrative action'),
          officerName: 'Hana Alemu · RO-218',
        }),
      })
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success) {
            // refresh directory from live backend
            fetch('http://localhost:5000/api/admin/merchants/directory')
              .then((r) => r.json())
              .then((d) => d.success && Array.isArray(d.data) && setMerchants(d.data))
              .catch(() => {});
          }
        })
        .catch(() => {});

      setApplications((current) =>
        current.map((item) =>
          item.ref === selectedApplication.ref ? { ...item, status: nextStatus } : item
        )
      );
      setAuditEvents((current) => [
        {
          timestamp: nowFormatted,
          officer: 'Hana Alemu · RO-218',
          action: `Merchant ${
            decision.kind === 'approve'
              ? 'approved'
              : decision.kind === 'request'
              ? 'information requested'
              : 'rejected'
          }`,
          reference: selectedApplication.ref,
          statusTransition: `${previous} → ${nextStatus}`,
          notes: decisionReason || 'Verification checks completed',
        },
        ...current,
      ]);
      navigate('approvals');
    } else {
      const previous = selectedReport.status;
      setReports((current) =>
        current.map((item) =>
          item.ref === selectedReport.ref ? { ...item, status: nextStatus } : item
        )
      );
      setAuditEvents((current) => [
        {
          timestamp: nowFormatted,
          officer: 'Hana Alemu · RO-218',
          action: `Tax report ${
            decision.kind === 'approve'
              ? 'approved'
              : decision.kind === 'request'
              ? 'information requested'
              : 'rejected'
          }`,
          reference: selectedReport.ref,
          statusTransition: `${previous} → ${nextStatus}`,
          notes: decisionReason || 'Report reconciliation reviewed',
        },
        ...current,
      ]);
      navigate('reports');
    }

    setDecision(null);
    setDecisionReason('');
  };

  if (!signedIn) {
    return (
      <OfficerSignIn
        onSuccess={() => setSignedIn(true)}
        onReturnToMerchant={onReturnToMerchant}
      />
    );
  }

  return (
    <div className={styles.rootContainer}>
      {/* Fixed Admin Sidebar */}
      <AdminSidebar
        currentPage={page}
        onNavigate={navigate}
        onSignOut={() => setSignedIn(false)}
      />

      {/* Main Container */}
      <div className={styles.mainLayout}>
        <AdminTopbar
          title={pageTitles[page]}
          globalSearch={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
          onGlobalSearchSubmit={(e) => {
            e.preventDefault();
            setDirectorySearch(globalSearch);
            setDirectoryQuery(globalSearch);
            navigate('directory');
          }}
          onProfileClick={() => navigate('settings')}
          currentPage={page}
          onNavigate={navigate}
        />

        <main className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.headingTitle}>{pageTitles[page]}</h1>
              <p className={styles.headingCopy}>
                Authorized officer workspace · All records below are fictional prototype data.
              </p>
            </div>
            <Badge tone="neutral">Prototype only</Badge>
          </div>

          {page === 'overview' && (
            <AdminOverview
              applications={applications}
              reports={reports}
              auditEvents={auditEvents}
              onReviewMerchant={reviewMerchant}
              onReviewReport={reviewReport}
              onNavigateToApprovals={() => navigate('approvals')}
              onNavigateToReports={() => navigate('reports')}
              getToneForStatus={getToneForStatus}
            />
          )}

          {page === 'approvals' && (
            <MerchantApprovals
              applications={applications}
              onReviewMerchant={reviewMerchant}
              getToneForStatus={getToneForStatus}
            />
          )}

          {page === 'merchantReview' && (
            <MerchantReview
              application={selectedApplication}
              onBack={() => navigate('approvals')}
              onOpenDecision={setDecision}
              getToneForStatus={getToneForStatus}
            />
          )}

          {page === 'directory' && (
            <MerchantDirectory
              merchants={directoryResults}
              searchQuery={directorySearch}
              onSearchQueryChange={setDirectorySearch}
              onSearchSubmit={() => setDirectoryQuery(directorySearch)}
              onViewDetails={(tin) => {
                setDirectorySearch(tin);
                navigate('merchantDetails');
              }}
              getToneForStatus={getToneForStatus}
            />
          )}

          {page === 'merchantDetails' && (
            <MerchantDetails
              merchant={selectedDirectoryMerchant}
              onBack={() => navigate('directory')}
              renderSales={() => <SalesRecords />}
              renderTaxRecords={() => (
                <TaxRecordsLedger
                  onSelectMerchant={(merchantName) => {
                    const match = merchants.find((m) => m.name === merchantName);
                    if (match) {
                      setDirectorySearch(match.tin);
                      navigate('merchantDetails');
                    }
                  }}
                  getToneForStatus={getToneForStatus}
                />
              )}
              getToneForStatus={getToneForStatus}
            />
          )}

          {page === 'sales' && <SalesRecords />}

          {page === 'reports' && (
            <TaxReports
              reports={reports}
              onReviewReport={reviewReport}
              getToneForStatus={getToneForStatus}
            />
          )}

          {page === 'reportReview' && (
            <TaxReportReview
              report={selectedReport}
              onBack={() => navigate('reports')}
              onOpenDecision={setDecision}
            />
          )}

          {page === 'taxRecords' && (
            <TaxRecordsLedger
              onSelectMerchant={(merchantName) => {
                const match = merchants.find((m) => m.name === merchantName);
                if (match) {
                  setDirectorySearch(match.tin);
                  navigate('merchantDetails');
                }
              }}
              getToneForStatus={getToneForStatus}
            />
          )}

          {page === 'audit' && <AdminAuditLog auditEvents={auditEvents} />}

          {page === 'settings' && <AdminSettings />}
        </main>
      </div>

      {/* Decision Modal */}
      {decision && (
        <DecisionModal
          decision={decision}
          reason={decisionReason}
          onReasonChange={setDecisionReason}
          onCancel={() => setDecision(null)}
          onConfirm={applyDecision}
        />
      )}
    </div>
  );
};

export default Admin;
