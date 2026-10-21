import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout/AdminLayout';
import { OfficerLoginForm } from './auth/components/OfficerLoginForm';
import { OfficerMetricsGrid } from './overview/components/OfficerMetricsGrid';
import { RecentDecisionsFeed } from './overview/components/RecentDecisionsFeed';
import { ApprovalsTabFilter } from './merchant-approvals/components/ApprovalsTabFilter';
import { ApprovalsTable } from './merchant-approvals/components/ApprovalsTable';
import { TaxpayerSearchCard } from './merchant-directory/components/TaxpayerSearchCard';
import { MerchantDirectoryTable } from './merchant-directory/components/MerchantDirectoryTable';
import { TaxReportsTable } from './tax-reports/components/TaxReportsTable';
import { AdminAuditLogTable } from './audit-log/components/AdminAuditLogTable';

import type { ApprovalStatus, MerchantApplication } from './merchant-approvals/types/approvalsTypes';
import type { DirectoryMerchant } from './merchant-directory/types/directoryTypes';
import type { AdminTaxReportItem } from './tax-reports/types/taxReportsTypes';
import type { AdminAuditEntry } from './audit-log/types/adminAuditTypes';
import type { RecentDecision } from './overview/types/adminOverviewTypes';

import styles from './AdminPortal.module.css';

interface AdminPortalProps {
  onReturnToMerchant?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onReturnToMerchant }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Approvals state
  const [approvalFilterTab, setApprovalFilterTab] = useState<'all' | ApprovalStatus>('all');
  const [approvalsSearch, setApprovalsSearch] = useState('');
  const [applications, setApplications] = useState<MerchantApplication[]>([
    {
      id: 'app-1',
      businessName: 'Addis Fresh Supermarket PLC',
      tradeName: 'Fresh Mart Bole',
      tin: '0048192841',
      taxCategory: 'VAT 15%',
      sector: 'Retail',
      applicantName: 'Yonas Getachew',
      phone: '+251 91 122 3344',
      email: 'yonas@freshmart.et',
      city: 'Addis Ababa',
      subCity: 'Bole',
      building: 'Mega Plaza 3rd Floor',
      submissionDate: '2026-10-21',
      documents: [
        { name: 'Trade_License_2026.pdf', type: 'application/pdf', size: '2.4 MB', status: 'verified' },
        { name: 'TIN_Registration_Cert.pdf', type: 'application/pdf', size: '1.1 MB', status: 'verified' },
        { name: 'Lease_Agreement_Bole.pdf', type: 'application/pdf', size: '3.8 MB', status: 'verified' },
      ],
      status: 'pending',
    },
    {
      id: 'app-2',
      businessName: 'Awash Highland Logistics',
      tradeName: 'Awash Express Delivery',
      tin: '0059281720',
      taxCategory: 'VAT 15%',
      sector: 'Services',
      applicantName: 'Mulugeta Bekele',
      phone: '+251 92 334 5566',
      email: 'mulugeta@awashexpress.et',
      city: 'Addis Ababa',
      subCity: 'Kirkos',
      building: 'Meskel Flower Tower 1st Floor',
      submissionDate: '2026-10-21',
      documents: [
        { name: 'Transport_Ministry_Permit.pdf', type: 'application/pdf', size: '1.9 MB', status: 'verified' },
        { name: 'TIN_Certificate.pdf', type: 'application/pdf', size: '850 KB', status: 'verified' },
      ],
      status: 'pending',
    },
    {
      id: 'app-3',
      businessName: 'Lucy Traditional Coffee Roasters',
      tradeName: 'Lucy Coffee House',
      tin: '0039281720',
      taxCategory: 'TOT 2%',
      sector: 'Hospitality',
      applicantName: 'Rahel Wolde',
      phone: '+251 93 445 6677',
      email: 'rahel@lucycoffee.et',
      city: 'Addis Ababa',
      subCity: 'Yeka',
      building: 'Megenagna Roundabout No. 12',
      submissionDate: '2026-10-20',
      documents: [
        { name: 'Trade_License_Yeka.pdf', type: 'application/pdf', size: '1.5 MB', status: 'verified' },
      ],
      status: 'action_required',
      decisionNotes: 'Requested updated trade license document with readable expiration seal.',
    },
    {
      id: 'app-4',
      businessName: 'Entoto Artisan Textiles',
      tradeName: 'Entoto Craft Studio',
      tin: '0019284729',
      taxCategory: 'TOT 2%',
      sector: 'Manufacturing',
      applicantName: 'Hiwot Tesfaye',
      phone: '+251 94 556 7788',
      email: 'hiwot@entototextiles.et',
      city: 'Addis Ababa',
      subCity: 'Gulele',
      building: 'Shiro Meda Artisan Compound',
      submissionDate: '2026-10-19',
      documents: [
        { name: 'Manufacturing_License.pdf', type: 'application/pdf', size: '2.1 MB', status: 'verified' },
        { name: 'TIN_Certificate.pdf', type: 'application/pdf', size: '920 KB', status: 'verified' },
      ],
      status: 'pending',
    },
    {
      id: 'app-5',
      businessName: 'Abyssinia Trading PLC',
      tradeName: 'Abyssinia General Import',
      tin: '0048192041',
      taxCategory: 'VAT 15%',
      sector: 'Wholesale',
      applicantName: 'Tewodros Kassahun',
      phone: '+251 91 778 9900',
      email: 'tewodros@abyssiniatrading.et',
      city: 'Addis Ababa',
      subCity: 'Arada',
      building: 'Piazza Central Arcade',
      submissionDate: '2026-10-18',
      documents: [
        { name: 'Import_Export_License.pdf', type: 'application/pdf', size: '3.2 MB', status: 'verified' },
        { name: 'TIN_Verification_Slip.pdf', type: 'application/pdf', size: '1.4 MB', status: 'verified' },
      ],
      status: 'approved',
      accreditationNo: 'EIMS-2026-0094',
    },
  ]);

  // Directory state
  const [directorySearch, setDirectorySearch] = useState('');
  const [directorySector, setDirectorySector] = useState('all');
  const [directoryStatus, setDirectoryStatus] = useState('all');
  const [merchants] = useState<DirectoryMerchant[]>([
    {
      id: 'm-1',
      legalName: 'Abyssinia Trading PLC',
      tradeName: 'Abyssinia General Import',
      tin: '0048192041',
      sector: 'Wholesale',
      taxCategory: 'VAT 15%',
      city: 'Addis Ababa',
      subCity: 'Arada',
      accreditationNo: 'EIMS-2026-0094',
      registeredDate: '2026-10-18',
      status: 'active',
      contactPhone: '+251 91 778 9900',
    },
    {
      id: 'm-2',
      legalName: "Kaldi's Coffee Roasting PLC",
      tradeName: "Kaldi's Coffee Bole",
      tin: '0019284729',
      sector: 'Hospitality',
      taxCategory: 'VAT 15%',
      city: 'Addis Ababa',
      subCity: 'Bole',
      accreditationNo: 'EIMS-2026-0093',
      registeredDate: '2026-09-12',
      status: 'active',
      contactPhone: '+251 91 234 5678',
    },
    {
      id: 'm-3',
      legalName: 'Sheger Retail Goods Enterprise',
      tradeName: 'Sheger Fresh Mart',
      tin: '0029481720',
      sector: 'Retail',
      taxCategory: 'TOT 2%',
      city: 'Addis Ababa',
      subCity: 'Nifas Silk-Lafto',
      accreditationNo: 'EIMS-2026-0081',
      registeredDate: '2026-08-04',
      status: 'under_audit',
      contactPhone: '+251 92 987 6543',
    },
    {
      id: 'm-4',
      legalName: 'Ethiopian Agro Processing SC',
      tradeName: 'Ethio Organics',
      tin: '0039284711',
      sector: 'Manufacturing',
      taxCategory: 'VAT 15%',
      city: 'Addis Ababa',
      subCity: 'Akaki Kality',
      accreditationNo: 'EIMS-2026-0075',
      registeredDate: '2026-07-22',
      status: 'active',
      contactPhone: '+251 93 111 2233',
    },
    {
      id: 'm-5',
      legalName: 'Blue Nile IT & Hardware Solutions',
      tradeName: 'Blue Nile Tech',
      tin: '0069182744',
      sector: 'Services',
      taxCategory: 'VAT 15%',
      city: 'Addis Ababa',
      subCity: 'Kirkos',
      accreditationNo: 'EIMS-2026-0062',
      registeredDate: '2026-06-15',
      status: 'suspended',
      contactPhone: '+251 94 444 5566',
    },
  ]);

  // Tax reports state
  const [taxReports] = useState<AdminTaxReportItem[]>([
    {
      id: 'rep-1',
      merchantName: 'Abyssinia Trading PLC',
      tradeName: 'Abyssinia General Import',
      tin: '0048192041',
      period: 'Meskerem 2026 (Sep 2026)',
      declaredSales: 1845000.0,
      declaredExpenses: 920000.0,
      calculatedTax: 276750.0,
      filingStatus: 'reconciled',
      filedDate: '2026-10-15',
    },
    {
      id: 'rep-2',
      merchantName: "Kaldi's Coffee Roasting PLC",
      tradeName: "Kaldi's Coffee Bole",
      tin: '0019284729',
      period: 'Meskerem 2026 (Sep 2026)',
      declaredSales: 1420800.0,
      declaredExpenses: 680000.0,
      calculatedTax: 213120.0,
      filingStatus: 'reconciled',
      filedDate: '2026-10-14',
    },
    {
      id: 'rep-3',
      merchantName: 'Sheger Retail Goods Enterprise',
      tradeName: 'Sheger Fresh Mart',
      tin: '0029481720',
      period: 'Meskerem 2026 (Sep 2026)',
      declaredSales: 890000.0,
      declaredExpenses: 410000.0,
      calculatedTax: 17800.0,
      filingStatus: 'discrepancy_flagged',
      filedDate: '2026-10-17',
    },
    {
      id: 'rep-4',
      merchantName: 'Ethiopian Agro Processing SC',
      tradeName: 'Ethio Organics',
      tin: '0039284711',
      period: 'Meskerem 2026 (Sep 2026)',
      declaredSales: 3120000.0,
      declaredExpenses: 1950000.0,
      calculatedTax: 468000.0,
      filingStatus: 'payment_pending',
      filedDate: '2026-10-18',
    },
  ]);

  // Audit log entries
  const [auditLogs, setAuditLogs] = useState<AdminAuditEntry[]>([
    {
      id: 'log-1',
      timestamp: '2026-10-21 21:42:05',
      officerName: 'Hana Alemu',
      officerId: 'RO-218',
      actionType: 'MERCHANT_APPROVAL',
      targetEntity: 'Abyssinia Trading PLC',
      tin: '0048192041',
      details: 'Issued accreditation certificate EIMS-2026-0094 with verified Trade License',
      ipAddress: '196.188.12.44',
      hash: '9a8f...3d12',
    },
    {
      id: 'log-2',
      timestamp: '2026-10-21 19:15:30',
      officerName: 'Hana Alemu',
      officerId: 'RO-218',
      actionType: 'CLARIFICATION_REQUESTED',
      targetEntity: 'Lucy Traditional Coffee Roasters',
      tin: '0039281720',
      details: 'Requested re-upload of expired regional trade permit seal',
      ipAddress: '196.188.12.44',
      hash: 'b4c1...8f9e',
    },
    {
      id: 'log-3',
      timestamp: '2026-10-21 16:30:12',
      officerName: 'Dawit Tadesse',
      officerId: 'RO-104',
      actionType: 'RECORD_FLAGGED',
      targetEntity: 'Sheger Retail Goods Enterprise',
      tin: '0029481720',
      details: 'Audit variance detected between eReceipt gateway register and submitted TOT form',
      ipAddress: '196.188.15.89',
      hash: '7e22...4a01',
    },
    {
      id: 'log-4',
      timestamp: '2026-10-20 14:02:44',
      officerName: 'Hana Alemu',
      officerId: 'RO-218',
      actionType: 'TAX_CLEARANCE_ISSUED',
      targetEntity: "Kaldi's Coffee Roasting PLC",
      tin: '0019284729',
      details: 'Generated clearance voucher for Q1 2026 VAT compliance',
      ipAddress: '196.188.12.44',
      hash: 'c810...56bc',
    },
  ]);

  const [recentDecisions, setRecentDecisions] = useState<RecentDecision[]>([
    {
      id: 'dec-1',
      officerName: 'Hana Alemu',
      officerId: 'RO-218',
      action: 'approved',
      targetMerchant: 'Abyssinia Trading PLC',
      tin: '0048192041',
      referenceNo: 'EIMS-2026-0094',
      timestamp: '12 mins ago',
      notes: 'All business license credentials validated. Accreditation certificate issued.',
    },
    {
      id: 'dec-2',
      officerName: 'Hana Alemu',
      officerId: 'RO-218',
      action: 'clarification',
      targetMerchant: 'Lucy Traditional Coffee Roasters',
      tin: '0039281720',
      timestamp: '45 mins ago',
      notes: 'Requested updated trade license document with readable expiration seal.',
    },
    {
      id: 'dec-3',
      officerName: 'Dawit Tadesse',
      officerId: 'RO-104',
      action: 'flagged',
      targetMerchant: 'Sheger Fresh Mart',
      tin: '0029481720',
      timestamp: '2 hours ago',
      notes: 'Reconciliation difference between TOT filing and eReceipt log.',
    },
  ]);

  // Officer action handlers
  const handleApproveApplication = (id: string) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;

    const accCode = `EIMS-2026-009${applications.filter((a) => a.status === 'approved').length + 5}`;

    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved', accreditationNo: accCode } : a))
    );

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: now,
        officerName: 'Hana Alemu',
        officerId: 'RO-218',
        actionType: 'MERCHANT_APPROVAL',
        targetEntity: app.businessName,
        tin: app.tin,
        details: `Approved accreditation ${accCode} for ${app.businessName}`,
        ipAddress: '196.188.12.44',
        hash: `${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
      },
      ...prev,
    ]);

    setRecentDecisions((prev) => [
      {
        id: `dec-${Date.now()}`,
        officerName: 'Hana Alemu',
        officerId: 'RO-218',
        action: 'approved',
        targetMerchant: app.businessName,
        tin: app.tin,
        referenceNo: accCode,
        timestamp: 'Just now',
        notes: `Application approved and accreditation ${accCode} generated.`,
      },
      ...prev,
    ]);

    setToastMessage(`Accreditation ${accCode} successfully issued for ${app.businessName}!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleRequestClarification = (id: string) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;

    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'action_required' } : a))
    );

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: now,
        officerName: 'Hana Alemu',
        officerId: 'RO-218',
        actionType: 'CLARIFICATION_REQUESTED',
        targetEntity: app.businessName,
        tin: app.tin,
        details: 'Sent clarification notification to merchant for document re-upload',
        ipAddress: '196.188.12.44',
        hash: `${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
      },
      ...prev,
    ]);

    setToastMessage(`Clarification request sent to ${app.businessName}.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleRejectApplication = (id: string) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;

    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a))
    );

    setToastMessage(`Application for ${app.businessName} rejected.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const matchesTab = approvalFilterTab === 'all' || app.status === approvalFilterTab;
    const matchesQuery =
      approvalsSearch.trim() === '' ||
      app.businessName.toLowerCase().includes(approvalsSearch.toLowerCase()) ||
      app.tin.includes(approvalsSearch.trim());
    return matchesTab && matchesQuery;
  });

  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  const approvalCounts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    action_required: applications.filter((a) => a.status === 'action_required').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  // Filtered merchants directory
  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch =
      directorySearch.trim() === '' ||
      m.legalName.toLowerCase().includes(directorySearch.toLowerCase()) ||
      m.tradeName.toLowerCase().includes(directorySearch.toLowerCase()) ||
      m.tin.includes(directorySearch.trim());
    const matchesSector = directorySector === 'all' || m.sector === directorySector;
    const matchesStatus = directoryStatus === 'all' || m.status === directoryStatus;
    return matchesSearch && matchesSector && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <OfficerLoginForm
        onLogin={() => setIsAuthenticated(true)}
        onReturnToMerchant={onReturnToMerchant}
      />
    );
  }

  return (
    <div className={styles.portalRoot}>
      <AdminLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingApprovalsCount={pendingCount}
        onSignOut={() => setIsAuthenticated(false)}
      >
        {toastMessage && (
          <div className={styles.toastBanner}>
            <span>{toastMessage}</span>
            <button
              type="button"
              className={styles.toastClose}
              onClick={() => setToastMessage(null)}
            >
              &times;
            </button>
          </div>
        )}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div>
            <OfficerMetricsGrid />
            <RecentDecisionsFeed decisions={recentDecisions} />
          </div>
        )}

        {/* Tab 2: Approvals */}
        {activeTab === 'approvals' && (
          <div>
            <ApprovalsTabFilter
              currentTab={approvalFilterTab}
              onTabChange={setApprovalFilterTab}
              counts={approvalCounts}
              searchQuery={approvalsSearch}
              onSearchChange={setApprovalsSearch}
            />
            <ApprovalsTable
              applications={filteredApplications}
              onApprove={handleApproveApplication}
              onRequestClarification={handleRequestClarification}
              onReject={handleRejectApplication}
            />
          </div>
        )}

        {/* Tab 3: Directory */}
        {activeTab === 'directory' && (
          <div>
            <TaxpayerSearchCard
              searchQuery={directorySearch}
              onSearchChange={setDirectorySearch}
              selectedSector={directorySector}
              onSectorChange={setDirectorySector}
              selectedStatus={directoryStatus}
              onStatusChange={setDirectoryStatus}
              totalResults={filteredMerchants.length}
            />
            <MerchantDirectoryTable merchants={filteredMerchants} />
          </div>
        )}

        {/* Tab 4: Tax Reports */}
        {activeTab === 'reports' && (
          <div>
            <TaxReportsTable reports={taxReports} />
          </div>
        )}

        {/* Tab 5: Audit Trail */}
        {activeTab === 'audit' && (
          <div>
            <AdminAuditLogTable logs={auditLogs} />
          </div>
        )}
      </AdminLayout>
    </div>
  );
};

export default AdminPortal;
