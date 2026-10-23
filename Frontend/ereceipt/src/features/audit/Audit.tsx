import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import AuditFilterBar from './components/AuditFilterBar';
import MonthlyRecordsTable from './components/MonthlyRecordsTable';
import { initialMonthlyRecords } from './types';
import { ClearedInvoiceDocument } from '../tax-invoice-preview/components/ClearedInvoiceDocument';
import { SettingsVerticalNav, type SettingsTabId } from '../settings/components/SettingsVerticalNav';
import { BusinessProfileTab } from '../settings/components/tabs/BusinessProfileTab';
import { ReceiptIssuanceContent } from '../receipt-issuance';
import styles from './Audit.module.css';

interface AuditProps {
  initialScreen?: string;
  onNavigate?: (screen: string) => void;
}

function downloadCsv(filename: string, rows: string[][]) {
  const content = rows
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
    .join('\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export const Audit: React.FC<AuditProps> = ({ initialScreen = 'audit', onNavigate }) => {
  const [activeScreen, setActiveScreen] = useState<string>(initialScreen);
  const [settingsTab, setSettingsTab] = useState<SettingsTabId>('profile');

  // Audit state
  const [auditStartDate, setAuditStartDate] = useState('2026-01-01');
  const [auditEndDate, setAuditEndDate] = useState('2026-10-31');
  const [calculatedTax, setCalculatedTax] = useState<number | null>(null);
  const [taxApproved, setTaxApproved] = useState(false);

  const visibleAuditMonths = initialMonthlyRecords.filter(
    (record) =>
      record.key >= auditStartDate.slice(0, 7) &&
      record.key <= auditEndDate.slice(0, 7)
  );

  const handleCalculateTax = () => {
    const total = visibleAuditMonths.reduce((sum, item) => sum + item.tax, 0);
    setCalculatedTax(total);
    setTaxApproved(false);
  };

  const handleApproveTax = () => {
    setTaxApproved(true);
  };

  const handleDownloadReport = () => {
    if (calculatedTax === null) return;
    const csvRows = [
      ['Month', 'Income ETB', 'Expenses ETB', 'Tax ETB'],
      ...visibleAuditMonths.map((record) => [
        record.month,
        record.income.toFixed(2),
        record.expenses.toFixed(2),
        record.tax.toFixed(2),
      ]),
      ['Total approved tax', '', '', calculatedTax.toFixed(2)],
    ];
    downloadCsv('approved-tax-calculation-report.csv', csvRows);
  };

  const handleSidebarNavigate = (screen: string) => {
    if (screen === 'registration') {
      onNavigate?.('registration');
      return;
    }
    if (screen === 'admin') {
      onNavigate?.('admin');
      return;
    }
    if (screen === 'receipt-issuance') {
      setActiveScreen('pos');
      return;
    }
    setActiveScreen(screen);
  };

  return (
    <DashboardLayout activeScreen={activeScreen} onNavigate={handleSidebarNavigate}>
      {activeScreen === 'audit' && (
        <>
          <div className={styles.pageHead}>
            <div>
              <p className={styles.eyebrow}>Monthly tax review</p>
              <h1 className={styles.title}>Audit</h1>
              <p className={styles.copy}>
                Select a date range to review monthly income, expenses, and tax, then calculate
                the total tax for that period.
              </p>
            </div>
          </div>

          <AuditFilterBar
            startDate={auditStartDate}
            endDate={auditEndDate}
            onStartDateChange={(val) => {
              setAuditStartDate(val);
              setCalculatedTax(null);
              setTaxApproved(false);
            }}
            onEndDateChange={(val) => {
              setAuditEndDate(val);
              setCalculatedTax(null);
              setTaxApproved(false);
            }}
            onCalculateTax={handleCalculateTax}
            calculatedTax={calculatedTax}
            taxApproved={taxApproved}
            onApproveTax={handleApproveTax}
            onDownloadReport={handleDownloadReport}
            monthCount={visibleAuditMonths.length}
          />

          <MonthlyRecordsTable
            records={visibleAuditMonths}
            startDate={auditStartDate}
            endDate={auditEndDate}
          />
        </>
      )}

      {activeScreen === 'receipt' && (
        <>
          <div className={styles.pageHead}>
            <div>
              <p className={styles.eyebrow}>Ministry of Revenue · EIMS Compliance</p>
              <h1 className={styles.title}>Tax Invoice Document Preview</h1>
              <p className={styles.copy}>
                Official fiscal electronic tax invoice with Ministry of Revenue verified digital signature and QR clearance code.
              </p>
            </div>
          </div>

          <div style={{ maxWidth: '900px', margin: '20px auto 0 auto' }}>
            <ClearedInvoiceDocument onPrint={() => window.print()} />
          </div>
        </>
      )}

      {activeScreen === 'settings' && (
        <>
          <div className={styles.pageHead}>
            <div>
              <p className={styles.eyebrow}>Account & Organization</p>
              <h1 className={styles.title}>Merchant Settings</h1>
              <p className={styles.copy}>
                Manage your verified tax credentials, company profile, and notification preferences.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '240px 1fr',
              gap: '32px',
              marginTop: '20px',
              alignItems: 'flex-start',
            }}
          >
            <aside style={{ position: 'sticky', top: '24px' }}>
              <SettingsVerticalNav activeTab={settingsTab} onTabChange={setSettingsTab} />
            </aside>

            <div style={{ minWidth: 0 }}>
              {settingsTab === 'profile' && <BusinessProfileTab />}
              {settingsTab === 'preferences' && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '32px',
                  }}
                >
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                    System Preferences
                  </h2>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>
                    Configure default currency (ETB), fiscal calendar, and language preferences.
                  </p>
                </div>
              )}
              {settingsTab === 'notifications' && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '32px',
                  }}
                >
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                    Compliance Notifications
                  </h2>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>
                    Manage SMS and Email alerts for tax report deadlines and receipt clearances.
                  </p>
                </div>
              )}
              {settingsTab === 'security' && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '32px',
                  }}
                >
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                    Security & API Keys
                  </h2>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>
                    Manage Ministry of Revenue EIMS clearance credentials and digital signature keys.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeScreen === 'dashboard' && (
        <>
          <div className={styles.pageHead}>
            <div>
              <p className={styles.eyebrow}>Merchant Overview</p>
              <h1 className={styles.title}>Overview</h1>
              <p className={styles.copy}>Summary of current fiscal activities and MoR API connectivity.</p>
            </div>
          </div>
          <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '32px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
              Abeba Market Dashboard
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#64748B' }}>
              Your electronic tax register is online and connected to Ministry of Revenue real-time clearance.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActiveScreen('receipt')}
                className="btn-primary"
              >
                Preview Latest Tax Invoice
              </button>
              <button
                type="button"
                onClick={() => setActiveScreen('audit')}
                className="btn-primary"
                style={{ backgroundColor: '#12304A', borderColor: '#12304A' }}
              >
                Go to Monthly Audit
              </button>
            </div>
          </div>
        </>
      )}

      {activeScreen === 'pos' && (
        <ReceiptIssuanceContent onNavigate={handleSidebarNavigate} />
      )}

      {activeScreen === 'sales' && (
        <>
          <div className={styles.pageHead}>
            <div>
              <p className={styles.eyebrow}>Sales Ledger</p>
              <h1 className={styles.title}>Transactions</h1>
              <p className={styles.copy}>Search and filter recorded sales transactions.</p>
            </div>
          </div>
          <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '32px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>
              All cleared receipts are recorded cryptographically and audited monthly.
            </p>
            <button
              type="button"
              onClick={() => setActiveScreen('audit')}
              className="btn-primary"
              style={{ marginTop: '16px' }}
            >
              Calculate Monthly Tax
            </button>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Audit;
