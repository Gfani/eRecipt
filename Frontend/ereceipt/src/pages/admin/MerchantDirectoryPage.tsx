import React, { useState } from 'react';
import { TaxpayerSearchCard } from '../../features/admin/merchant-directory/components/TaxpayerSearchCard';
import { MerchantDirectoryTable } from '../../features/admin/merchant-directory/components/MerchantDirectoryTable';
import type { DirectoryMerchantItem } from '../../features/admin/types';

export const MerchantDirectoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [directoryQuery, setDirectoryQuery] = useState('');

  const [merchants] = useState<DirectoryMerchantItem[]>([
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
  ]);

  const filteredMerchants = merchants.filter(
    (m) =>
      !directoryQuery ||
      `${m.tin} ${m.id} ${m.name}`.toLowerCase().includes(directoryQuery.toLowerCase())
  );

  return (
    <div>
      <TaxpayerSearchCard
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={() => setDirectoryQuery(searchQuery)}
      />
      <MerchantDirectoryTable
        merchants={filteredMerchants}
        onViewDetails={(tin) => alert(`Viewing details for TIN ${tin}`)}
        getToneForStatus={(status) => (status.includes('Approved') ? 'success' : 'pending')}
      />
    </div>
  );
};

export default MerchantDirectoryPage;
