import React from 'react';
import { Search } from 'lucide-react';
import styles from './TaxpayerSearchCard.module.css';

interface TaxpayerSearchCardProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
}

export const TaxpayerSearchCard: React.FC<TaxpayerSearchCardProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => {
  return (
    <div className={styles.searchCard}>
      <p className={styles.eyebrow}>Primary taxpayer lookup</p>
      <h2 className={styles.title}>Search Merchant by TIN</h2>
      <div className={styles.searchRow}>
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearchSubmit();
          }}
          className={styles.searchInput}
          placeholder="Enter TIN, merchant ID, or business name"
        />
        <button
          type="button"
          onClick={onSearchSubmit}
          className={styles.searchBtn}
        >
          <Search size={17} />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default TaxpayerSearchCard;
