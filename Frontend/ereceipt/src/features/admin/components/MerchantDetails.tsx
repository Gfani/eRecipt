import React, { useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Badge } from './Badge';
import type { Tone, DirectoryMerchantItem } from '../types';
import styles from './Directory.module.css';

interface MerchantDetailsProps {
  merchant: DirectoryMerchantItem;
  onBack: () => void;
  renderSales: () => React.ReactNode;
  renderTaxRecords: () => React.ReactNode;
  getToneForStatus: (status: string) => Tone;
}

export const MerchantDetails: React.FC<MerchantDetailsProps> = ({
  merchant,
  onBack,
  renderSales,
  renderTaxRecords,
  getToneForStatus,
}) => {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!merchant) {
    return (
      <div className={styles.container}>
        <button
          type="button"
          onClick={onBack}
          className={styles.backBtn}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#176B4D',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to directory</span>
        </button>
        <div className={styles.detailsHeaderCard} style={{ textAlign: 'center', padding: '48px 16px' }}>
          <p style={{ margin: 0, color: '#667069' }}>No merchant selected from the directory.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    'Overview',
    'Sales History',
    'Tax Records',
    'Tax Reports',
    'Documents',
    'Activity History',
  ];

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={onBack}
        className={styles.backBtn}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: 600,
          color: '#176B4D',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to directory</span>
      </button>

      {/* Merchant Header Card */}
      <div className={styles.detailsHeaderCard}>
        <div className={styles.detailsTopRow}>
          <div>
            <p style={{ margin: 0, fontSize: '12px', fontFamily: 'monospace', color: '#667069' }}>
              {merchant.id}
            </p>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700, color: '#17201B' }}>
              {merchant.name}
            </h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#667069' }}>
              TIN {merchant.tin} · {merchant.category}
            </p>
          </div>

          <div className={styles.badgesGroup}>
            <Badge tone={getToneForStatus(merchant.status)}>{merchant.status}</Badge>
            <Badge tone="info">{merchant.classification}</Badge>
            <Badge tone={getToneForStatus(merchant.authorization)}>
              Receipt: {merchant.authorization}
            </Badge>
          </div>
        </div>

        {/* Sub-tabs bar */}
        <div className={styles.tabsBar}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`${styles.tabBtn} ${
                  isActive ? styles.tabBtnActive : styles.tabBtnInactive
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' ? (
        <div className={styles.overviewGrid}>
          {/* Business Identification */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Business Identification</h3>
            <dl className={styles.idGrid}>
              {[
                ['Registration Date', '12 June 2025'],
                ['Verification Date', '18 June 2025'],
                ['TIN', merchant.tin],
                ['Merchant ID', merchant.id],
                ['Tax Classification', merchant.classification],
                ['Receipt Authorization', merchant.authorization],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt style={{ fontSize: '12px', color: '#667069' }}>{label}</dt>
                  <dd style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 600, color: '#17201B' }}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Current Period */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Current Period</h3>
            <div className={styles.statsList}>
              {[
                ['Recorded sales', 'ETB 1,482,500'],
                ['Receipts issued', '342'],
                ['Tax reports submitted', '9'],
                ['Outstanding tasks', '1'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className={styles.statItemLabel}>{label}</p>
                  <p className={styles.statItemValue}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'Sales History' ? (
        renderSales()
      ) : activeTab === 'Tax Records' ? (
        renderTaxRecords()
      ) : (
        <div style={{ border: '1px solid #DDE3DE', backgroundColor: '#FFFFFF', padding: '40px', textAlign: 'center' }}>
          <FileText size={32} style={{ margin: '0 auto', color: '#176B4D' }} />
          <h3 style={{ margin: '12px 0 0 0', fontWeight: 700, color: '#17201B' }}>{activeTab}</h3>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#667069' }}>
            Fictional merchant {activeTab.toLowerCase()} records are available for officer review.
          </p>
        </div>
      )}
    </div>
  );
};

export default MerchantDetails;
