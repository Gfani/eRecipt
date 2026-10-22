import React from 'react';
import { QuickActionCard } from './QuickActionCard';
import styles from './QuickActionGrid.module.css';

export const QuickActionGrid: React.FC = () => {
  return (
    <div className={styles.grid}>
      {/* 1. Issue a receipt */}
      <QuickActionCard
        title="Issue a receipt"
        description="Create and submit a new fiscal document for clearance."
        to="/merchant/receipts/issue"
        accentColor="teal"
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        }
      />

      {/* 2. Tax invoice preview */}
      <QuickActionCard
        title="Tax invoice preview"
        description="Review the official cleared invoice presentation."
        to="/merchant/invoices/preview"
        accentColor="blue"
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        }
      />

      {/* 3. Transactions */}
      <QuickActionCard
        title="Transactions"
        description="Review monthly income, tax, expenses, and cleared records."
        to="/merchant/transactions"
        accentColor="amber"
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      />

      {/* 4. Audit */}
      <QuickActionCard
        title="Audit"
        description="Review user actions and MoR EIMS response activity."
        to="/merchant/audit"
        accentColor="purple"
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        }
      />
    </div>
  );
};