import React from 'react';
import { Search } from 'lucide-react';
import styles from './TaxpayerSearchCard.module.css';

interface TaxpayerSearchCardProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSector: string;
  onSectorChange: (sector: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  totalResults: number;
}

export const TaxpayerSearchCard: React.FC<TaxpayerSearchCardProps> = ({
  searchQuery,
  onSearchChange,
  selectedSector,
  onSectorChange,
  selectedStatus,
  onStatusChange,
  totalResults,
}) => {
  return (
    <div className={styles.searchCard}>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>Taxpayer Directory Lookup</h3>
        <span className={styles.resultsCount}>{totalResults} verified taxpayers listed</span>
      </div>

      <div className={styles.controlsGrid}>
        <div className={styles.inputWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.input}
            placeholder="Search by legal name, trade name, or 10-digit TIN..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div>
          <select
            className={styles.select}
            value={selectedSector}
            onChange={(e) => onSectorChange(e.target.value)}
          >
            <option value="all">All Industry Sectors</option>
            <option value="Retail">Retail</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Services">Services</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Wholesale">Wholesale</option>
          </select>
        </div>

        <div>
          <select
            className={styles.select}
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All Taxpayer Statuses</option>
            <option value="active">Active & Compliant</option>
            <option value="under_audit">Under Audit Review</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaxpayerSearchCard;
