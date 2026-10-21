import React from 'react';
import { SalesRecordsMetrics } from '../../features/admin/sales-records/components/SalesRecordsMetrics';
import { SalesRecordsTable } from '../../features/admin/sales-records/components/SalesRecordsTable';

export const AdminSalesRecordsPage: React.FC = () => {
  return (
    <div>
      <SalesRecordsMetrics />
      <SalesRecordsTable />
    </div>
  );
};

export default AdminSalesRecordsPage;
