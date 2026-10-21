import React from 'react';
import { TaxReportsTable } from '../../features/admin/tax-reports/components/TaxReportsTable';
import type { TaxReportItem } from '../../features/admin/types';

const defaultReports: TaxReportItem[] = [
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
];

export const AdminTaxReportsPage: React.FC = () => {
  return (
    <div>
      <TaxReportsTable
        reports={defaultReports}
        onReviewReport={(ref) => alert(`Reviewing report ${ref}`)}
        getToneForStatus={(status) => (status.includes('Approved') ? 'success' : 'pending')}
      />
    </div>
  );
};

export default AdminTaxReportsPage;
