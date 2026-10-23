import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout/DashboardLayout';
import { TransactionsView } from '../features/transactions';

export interface TransactionsPageProps {
  onNavigate?: (screen: string) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onNavigate }) => {
  return (
    <DashboardLayout activeScreen="sales" onNavigate={onNavigate}>
      <TransactionsView onNavigate={onNavigate} />
    </DashboardLayout>
  );
};

export default TransactionsPage;
