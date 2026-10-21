import React, { useState } from 'react';
import { ApprovalsTabFilter } from '../../features/admin/merchant-approvals/components/ApprovalsTabFilter';
import { ApprovalsTable } from '../../features/admin/merchant-approvals/components/ApprovalsTable';
import type { MerchantApplicationItem } from '../../features/admin/types';

export const MerchantApprovalsPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('All Applications');
  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All business categories');
  const [statusFilter, setStatusFilter] = useState('All statuses');

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
  ]);

  const filteredApps = applications.filter((app) => {
    const matchesTab = currentTab === 'All Applications' || app.status === currentTab;
    const matchesCategory =
      categoryFilter === 'All business categories' || app.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'All statuses' || app.status.includes(statusFilter);
    return matchesTab && matchesCategory && matchesStatus;
  });

  return (
    <div>
      <ApprovalsTabFilter
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <ApprovalsTable
        applications={filteredApps}
        onReviewMerchant={(ref) => {
          setApplications((prev) =>
            prev.map((a) => (a.ref === ref ? { ...a, status: 'Approved' } : a))
          );
        }}
        getToneForStatus={(status) => (status.includes('Approved') ? 'success' : 'pending')}
      />
    </div>
  );
};

export default MerchantApprovalsPage;
