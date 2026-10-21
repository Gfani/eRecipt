import React, { useState } from 'react';
import { TaxpayerSearchCard } from '../../features/admin/merchant-directory/components/TaxpayerSearchCard';
import { MerchantDirectoryTable } from '../../features/admin/merchant-directory/components/MerchantDirectoryTable';
import type { DirectoryMerchant } from '../../features/admin/merchant-directory/types/directoryTypes';

export const MerchantDirectoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

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
  ]);

  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      m.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tin.includes(searchQuery.trim());
    const matchesSector = selectedSector === 'all' || m.sector === selectedSector;
    const matchesStatus = selectedStatus === 'all' || m.status === selectedStatus;
    return matchesSearch && matchesSector && matchesStatus;
  });

  return (
    <div>
      <TaxpayerSearchCard
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSector={selectedSector}
        onSectorChange={setSelectedSector}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        totalResults={filteredMerchants.length}
      />
      <MerchantDirectoryTable merchants={filteredMerchants} />
    </div>
  );
};

export default MerchantDirectoryPage;
