import React from 'react';
import { ShieldCheck, Printer, CheckCircle } from 'lucide-react';
import { MorVerifiedQrBlock } from './MorVerifiedQrBlock';
import styles from './ClearedInvoiceDocument.module.css';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number; // e.g. 0.15 for 15%
}

export interface PartyInfo {
  name: string;
  tin: string;
  vatRegistrationNo?: string;
  address: string;
  phone?: string;
}

export interface ClearedInvoiceDocumentProps {
  invoiceNumber?: string;
  issueDate?: string;
  seller?: PartyInfo;
  buyer?: PartyInfo;
  items?: InvoiceItem[];
  totalsInWords?: string;
  onPrint?: () => void;
}

const DEFAULT_SELLER: PartyInfo = {
  name: 'Abyssinia Cloud Tech Solutions PLC',
  tin: '0048192301',
  vatRegistrationNo: '98234-ET',
  address: 'Bldg 4A, Suite 201, Kirkos Sub-City, Addis Ababa, Ethiopia',
  phone: '+251 91 123 4567',
};

const DEFAULT_BUYER: PartyInfo = {
  name: 'Ethio Retail & Logistics Enterprise',
  tin: '0019842109',
  vatRegistrationNo: '87123-ET',
  address: 'Bole Medhanealem Road, Bole Sub-City, Addis Ababa, Ethiopia',
  phone: '+251 92 987 6543',
};

const DEFAULT_ITEMS: InvoiceItem[] = [
  {
    id: '1',
    description: 'Enterprise Cloud Infrastructure Subscription (1 Month)',
    quantity: 1,
    unitPrice: 8500.0,
    vatRate: 0.15,
  },
  {
    id: '2',
    description: 'Automated MoR EIMS Integration & Compliance Module',
    quantity: 1,
    unitPrice: 2400.0,
    vatRate: 0.15,
  },
];

export const ClearedInvoiceDocument: React.FC<ClearedInvoiceDocumentProps> = ({
  invoiceNumber = 'INV-2026-08492',
  issueDate = '22 Oct 2026',
  seller = DEFAULT_SELLER,
  buyer = DEFAULT_BUYER,
  items = DEFAULT_ITEMS,
  totalsInWords = 'Twelve Thousand Five Hundred Thirty-Five Ethiopian Birr and 00/100',
  onPrint,
}) => {
  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const vatAmount = items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice * item.vatRate,
    0
  );
  const grandTotal = subtotal + vatAmount;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-ET', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <article className={styles.documentCard} aria-label="Official Tax Invoice Document">
      {/* Invoice Header Row */}
      <header className={styles.headerRow}>
        <div className={styles.brandColumn}>
          <p className="eyebrow">Federal Democratic Republic of Ethiopia</p>
          <h1 className={styles.docTitle}>Official Tax Invoice</h1>
          <p className={styles.docSubtitle}>Ministry of Revenues Electronic Invoice Management System</p>
        </div>

        <div className={styles.statusColumn}>
          <div className={styles.badge}>
            <CheckCircle size={14} strokeWidth={2.5} />
            <span>Cleared Tax Invoice</span>
          </div>
          <div className={styles.invoiceMeta}>
            <div>
              <strong>Invoice No:</strong> {invoiceNumber}
            </div>
            <div>
              <strong>Issue Date:</strong> {issueDate}
            </div>
          </div>
        </div>
      </header>

      {/* Seller and Buyer Party Information */}
      <section className={styles.partiesGrid} aria-label="Transaction Parties">
        {/* Seller Info */}
        <div className={styles.partyBox}>
          <p className={styles.partyRole}>Supplier / Issuer</p>
          <h2 className={styles.partyName}>{seller.name}</h2>
          <div className={styles.partyDetailsList}>
            <div className={styles.partyDetailItem}>
              <span className={styles.partyLabel}>TIN:</span>
              <span>{seller.tin}</span>
            </div>
            {seller.vatRegistrationNo && (
              <div className={styles.partyDetailItem}>
                <span className={styles.partyLabel}>VAT Reg:</span>
                <span>{seller.vatRegistrationNo}</span>
              </div>
            )}
            <div className={styles.partyDetailItem}>
              <span className={styles.partyLabel}>Address:</span>
              <span>{seller.address}</span>
            </div>
            {seller.phone && (
              <div className={styles.partyDetailItem}>
                <span className={styles.partyLabel}>Tel:</span>
                <span>{seller.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Buyer Info */}
        <div className={styles.partyBox}>
          <p className={styles.partyRole}>Customer / Recipient</p>
          <h2 className={styles.partyName}>{buyer.name}</h2>
          <div className={styles.partyDetailsList}>
            <div className={styles.partyDetailItem}>
              <span className={styles.partyLabel}>TIN:</span>
              <span>{buyer.tin}</span>
            </div>
            {buyer.vatRegistrationNo && (
              <div className={styles.partyDetailItem}>
                <span className={styles.partyLabel}>VAT Reg:</span>
                <span>{buyer.vatRegistrationNo}</span>
              </div>
            )}
            <div className={styles.partyDetailItem}>
              <span className={styles.partyLabel}>Address:</span>
              <span>{buyer.address}</span>
            </div>
            {buyer.phone && (
              <div className={styles.partyDetailItem}>
                <span className={styles.partyLabel}>Tel:</span>
                <span>{buyer.phone}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Itemized Table */}
      <section className={styles.tableWrapper} aria-label="Itemized Tax Invoice Table">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col" style={{ width: '40px' }} className={styles.alignCenter}>
                #
              </th>
              <th scope="col">Item Description</th>
              <th scope="col" className={styles.alignCenter}>
                Qty
              </th>
              <th scope="col" className={styles.alignRight}>
                Unit Price (ETB)
              </th>
              <th scope="col" className={styles.alignCenter}>
                VAT Rate
              </th>
              <th scope="col" className={styles.alignRight}>
                VAT (ETB)
              </th>
              <th scope="col" className={styles.alignRight}>
                Total (ETB)
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const lineTaxable = item.quantity * item.unitPrice;
              const lineVat = lineTaxable * item.vatRate;
              const lineTotal = lineTaxable + lineVat;

              return (
                <tr key={item.id}>
                  <td className={styles.alignCenter}>{index + 1}</td>
                  <td>
                    <strong>{item.description}</strong>
                  </td>
                  <td className={styles.alignCenter}>{item.quantity}</td>
                  <td className={styles.alignRight}>{formatCurrency(item.unitPrice)}</td>
                  <td className={styles.alignCenter}>{Math.round(item.vatRate * 100)}%</td>
                  <td className={styles.alignRight}>{formatCurrency(lineVat)}</td>
                  <td className={styles.alignRight}>
                    <strong>{formatCurrency(lineTotal)}</strong>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Totals in Words & Calculation Grid */}
      <section className={styles.totalsSection} aria-label="Invoice Totals and Summary">
        <div className={styles.totalsInWords}>
          <span className={styles.wordsLabel}>Amount in Words (ETB):</span>
          <span className={styles.wordsValue}>{totalsInWords}</span>
        </div>

        <div className={styles.totalsGrid}>
          {/* Print / Actions hint */}
          <div>
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrint}
              style={{ minHeight: '38px', padding: '8px 16px', fontSize: '13px' }}
            >
              <Printer size={15} />
              Print / Save PDF
            </button>
          </div>

          <div className={styles.totalsList}>
            <div className={styles.totalRow}>
              <span>Subtotal (Net Amount):</span>
              <span>{formatCurrency(subtotal)} ETB</span>
            </div>
            <div className={styles.totalRow}>
              <span>VAT Amount (15%):</span>
              <span>{formatCurrency(vatAmount)} ETB</span>
            </div>
            <div className={styles.grandTotalRow}>
              <span>Grand Total:</span>
              <span className={styles.grandTotalAmount}>{formatCurrency(grandTotal)} ETB</span>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded MoR QR Block */}
      <section className={styles.qrContainerWrapper} aria-label="Ministry Clearance Verification Block">
        <MorVerifiedQrBlock />
      </section>

      {/* Legal Footer Note */}
      <footer className={styles.footer}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
          <ShieldCheck size={14} color="var(--color-primary)" />
          <strong>Federal Democratic Republic of Ethiopia • Ministry of Revenues (MoR)</strong>
        </div>
        <p style={{ margin: 0 }}>
          This electronic fiscal document is legally compliant and authenticated via the MoR EIMS clearance gateway.
          Tampering with electronic fiscal records is punishable by federal law.
        </p>
      </footer>
    </article>
  );
};

export default ClearedInvoiceDocument;
