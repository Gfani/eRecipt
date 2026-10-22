import React from 'react';
import { OfficerMetricsGrid } from '../../features/admin/overview/components/OfficerMetricsGrid';
import { RecentDecisionsFeed } from '../../features/admin/overview/components/RecentDecisionsFeed';

export const AdminOverviewPage: React.FC = () => {
  return (
    <div>
      <OfficerMetricsGrid />
      <RecentDecisionsFeed />
    </div>
  );
};

export default AdminOverviewPage;
