import React, { useState } from 'react';
import { ApprovalsTabFilter } from '../../features/admin/merchant-approvals/components/ApprovalsTabFilter';
import { ApprovalsTable } from '../../features/admin/merchant-approvals/components/ApprovalsTable';
import type { ApprovalStatus, MerchantApplication } from '../../features/admin/merchant-approvals/types/approvalsTypes';

export const MerchantApprovalsPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'all' | ApprovalStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
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
    },
  ]);

  const filteredApps = applications.filter((app) => {
    const matchesTab = currentTab === 'all' || app.status === currentTab;
    const matchesQuery =
      searchQuery.trim() === '' ||
      app.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tin.includes(searchQuery.trim());
    return matchesTab && matchesQuery;
  });

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    action_required: applications.filter((a) => a.status === 'action_required').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div>
      <ApprovalsTabFilter
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        counts={counts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ApprovalsTable
        applications={filteredApps}
        onApprove={(id) => {
          setApplications((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a))
          );
        }}
        onRequestClarification={(id) => {
          setApplications((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: 'action_required' } : a))
          );
        }}
        onReject={(id) => {
          setApplications((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a))
          );
        }}
      />
    </div>
  );
};

export default MerchantApprovalsPage;
