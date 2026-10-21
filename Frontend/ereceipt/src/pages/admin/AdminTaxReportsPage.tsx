import React from 'react';
import { TaxReportsTable } from '../../features/admin/tax-reports/components/TaxReportsTable';
import type { AdminTaxReportItem } from '../../features/admin/tax-reports/types/taxReportsTypes';

const defaultReports: AdminTaxReportItem[] = [
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
];

export const AdminTaxReportsPage: React.FC = () => {
  return (
    <div>
      <TaxReportsTable reports={defaultReports} />
    </div>
  );
};

export default AdminTaxReportsPage;
