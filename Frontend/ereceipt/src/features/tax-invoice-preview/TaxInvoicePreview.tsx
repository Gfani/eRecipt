import React from 'react';
import { ClearedInvoiceDocument } from './components/ClearedInvoiceDocument';
import styles from './TaxInvoicePreview.module.css';

export const TaxInvoicePreview: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Ministry of Revenue · EIMS Compliance</span>
          <h1 className={styles.title}>Tax Invoice Document Preview</h1>
          <p className={styles.subtitle}>
            Official fiscal electronic tax invoice with Ministry of Revenue verified digital signature and QR clearance code.
          </p>
        </div>
      </header>

      <main className={styles.documentWrapper}>
        <ClearedInvoiceDocument onPrint={() => window.print()} />
      </main>
    </div>
  );
};

export default TaxInvoicePreview;
