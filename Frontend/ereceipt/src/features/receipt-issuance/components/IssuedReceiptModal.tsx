import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Landmark,
  Store,
  MapPin,
  ShieldCheck,
  Printer,
  Copy,
  Check,
  Languages,
  Plus,
} from 'lucide-react';
import type { IssuedReceipt } from '../types';
import {
  formatMoney,
  amountInWords,
  amountInAmharic,
  netLineAmount,
  lineExcise,
} from '../types';
import styles from './IssuedReceiptModal.module.css';

interface IssuedReceiptModalProps {
  receipt: IssuedReceipt;
  onClose: () => void;
  onReset: () => void;
}

const QR_PATTERN = Array.from({ length: 225 }, (_, index) => {
  const row = Math.floor(index / 15);
  const col = index % 15;
  const finder =
    (row < 5 && col < 5) || (row < 5 && col > 9) || (row > 9 && col < 5);
  return finder || ((row * 7 + col * 11 + row * col) % 5 < 2);
});

export const IssuedReceiptModal: React.FC<IssuedReceiptModalProps> = ({
  receipt,
  onClose,
  onReset,
}) => {
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const [copied, setCopied] = useState(false);

  const words =
    language === 'en'
      ? amountInWords(receipt.total)
      : amountInAmharic(receipt.total);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/eims/verify/${receipt.irn}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handlePrintThermal = () => {
    const printWindow = window.open('', '_blank', 'width=420,height=760');
    if (!printWindow) return;

    const lines = receipt.items
      .map(
        (item) =>
          `<tr><td>${item.name}<br><small>${item.qty} ${item.uom} × ${formatMoney(
            item.price
          )} · VAT ${item.vatCategory}</small></td><td style="text-align:right">${formatMoney(
            netLineAmount(item) + lineExcise(item)
          )}</td></tr>`
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>MoR EIMS Cleared - ${receipt.irn}</title>
          <style>
            body {
              width: 72mm;
              margin: 0 auto;
              padding: 4mm;
              font-family: monospace, sans-serif;
              font-size: 11px;
              color: #111;
            }
            h1 { font-size: 15px; text-align: center; margin: 0; }
            p { text-align: center; margin: 3px 0; }
            .rule { border-top: 1px dashed #333; margin: 6px 0; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 3px 0; vertical-align: top; }
            .total { font-weight: bold; font-size: 13px; }
            .qr-placeholder {
              width: 30mm;
              height: 30mm;
              margin: 8px auto;
              border: 2px solid #111;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 9px;
            }
          </style>
        </head>
        <body>
          <h1>Abeba Market PLC</h1>
          <p>MoR EIMS CLEARED<br>TIN: 0012345642 · VAT: VAT-ET-0012345642</p>
          <div class="rule"></div>
          <p><b>IRN:</b> ${receipt.irn}<br><b>RRN:</b> ${receipt.rrn}<br>${receipt.clearanceTimestamp}</p>
          <div class="rule"></div>
          <table>${lines}</table>
          <div class="rule"></div>
          <table>
            <tr><td>Net subtotal:</td><td style="text-align:right">ETB ${formatMoney(receipt.subtotal)}</td></tr>
            <tr><td>Excise tax:</td><td style="text-align:right">ETB ${formatMoney(receipt.exciseTax)}</td></tr>
            <tr><td>VAT (15%):</td><td style="text-align:right">ETB ${formatMoney(receipt.tax)}</td></tr>
            ${receipt.withholdingTax > 0 ? `<tr><td>Withholding (2%):</td><td style="text-align:right">-ETB ${formatMoney(receipt.withholdingTax)}</td></tr>` : ''}
            <tr class="total"><td>GRAND TOTAL:</td><td style="text-align:right">ETB ${formatMoney(receipt.total)}</td></tr>
          </table>
          <div class="qr-placeholder">MoR EIMS QR CODE</div>
          <p>Scan to verify authenticity on MoR EIMS.<br>የሰነዱን ትክክለኛነት በMoR ያረጋግጡ</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 350);
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleGroup}>
            <h2 className={styles.modalTitle}>Tax invoice clearance record</h2>
            <span className={styles.clearedPill}>
              <CheckCircle2 size={14} /> MoR Cleared
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.scrollArea}>
          <div className={styles.receiptDoc}>
            {/* MoR Banner */}
            <div className={styles.morBanner}>
              <div className={styles.morLeft}>
                <div className={styles.morIconWrapper}>
                  <Landmark size={22} />
                </div>
                <div>
                  <p className={styles.morEyebrow}>Ministry of Revenues · EIMS</p>
                  <h3 className={styles.morHeading}>Official real-time clearance confirmed</h3>
                </div>
              </div>
              <span className={styles.clearedBadgeWhite}>
                <CheckCircle2 size={16} /> MoR CLEARED
              </span>
            </div>

            <div className={styles.receiptBody}>
              {/* Seller details */}
              <div className={styles.sellerGrid}>
                <div className={styles.sellerInfo}>
                  <div className={styles.sellerHeader}>
                    <div className={styles.sellerIcon}>
                      <Store size={22} />
                    </div>
                    <div>
                      <h4 className={styles.sellerTitle}>Abeba Market PLC</h4>
                      <p className={styles.sellerTradeName}>Trade name: Abeba Market</p>
                    </div>
                  </div>

                  <div className={styles.sellerMetaGrid}>
                    <p>
                      <b>Seller TIN:</b> 0012345642<br />
                      <b>VAT No:</b> VAT-ET-0012345642
                    </p>
                    <p>
                      <b>Branch:</b> Bole Main Outlet ({receipt.branchCode})<br />
                      <b>Address:</b> Bole, Woreda 03, House 114<br />
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} /> 8.9806° N, 38.7578° E
                      </span>
                    </p>
                    <p>
                      <b>Cashier:</b> Tigist Getachew<br />
                      <b>Operator ID:</b> CASH-014 / {receipt.registerCode}
                    </p>
                    <p>
                      <b>Receipt No:</b> {receipt.receiptNumber}<br />
                      <b>Series:</b> {receipt.fiscalYear} / #{receipt.sequence}
                    </p>
                  </div>
                </div>

                <div className={styles.fiscalBox}>
                  <p className={styles.fiscalDocType}>{receipt.documentType}</p>
                  <dl className={styles.fiscalDl}>
                    <dt>Invoice Registration Number (IRN)</dt>
                    <dd>{receipt.irn}</dd>
                    <dt>Receipt Registration Number (RRN)</dt>
                    <dd>{receipt.rrn}</dd>
                    <dt>Clearance timestamp</dt>
                    <dd>{receipt.clearanceTimestamp}</dd>
                  </dl>
                </div>
              </div>

              {/* Buyer details */}
              <div className={styles.buyerBox}>
                <div>
                  <p className={styles.buyerLabel}>Buyer / {receipt.transactionMode}</p>
                  <p className={styles.buyerName}>{receipt.customerName || 'Walk-in customer'}</p>
                  <p className={styles.buyerMeta}>
                    TIN: {receipt.customerTin || 'Not provided'}<br />
                    Fayda FIN: {receipt.customerNationalId || 'Not provided'}<br />
                    VAT: {receipt.customerVat || 'Not provided'}<br />
                    Contact: {receipt.customerPhone || 'Not provided'}
                  </p>
                </div>

                {receipt.originalIrn && (
                  <div>
                    <p className={styles.buyerLabel}>Original IRN &amp; Reason</p>
                    <p className={styles.buyerName} style={{ fontFamily: 'monospace', fontSize: 13 }}>
                      {receipt.originalIrn}
                    </p>
                    <p className={styles.buyerMeta}>{receipt.adjustmentReason}</p>
                  </div>
                )}
              </div>

              {/* Line items table */}
              <div className={styles.itemsTableWrapper}>
                <table className={styles.itemsTable}>
                  <thead>
                    <tr>
                      <th>Code / Item or service</th>
                      <th>Qty / UoM</th>
                      <th style={{ textAlign: 'right' }}>Unit price</th>
                      <th style={{ textAlign: 'right' }}>Discount</th>
                      <th>VAT category</th>
                      <th>Excise</th>
                      <th style={{ textAlign: 'right' }}>Net + excise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipt.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <span
                            style={{
                              display: 'block',
                              fontFamily: 'monospace',
                              fontSize: 11,
                              color: 'var(--color-primary-active, #0F766E)',
                            }}
                          >
                            {item.code}
                          </span>
                          <span style={{ fontWeight: 600, color: '#1F2937' }}>{item.name}</span>
                        </td>
                        <td>
                          {item.qty} {item.uom}
                        </td>
                        <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          {formatMoney(item.price)}
                        </td>
                        <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          {formatMoney(item.discount)}
                        </td>
                        <td>{item.vatCategory}</td>
                        <td>
                          {item.exciseRate}%
                          {item.exciseRate > 0 && (
                            <span style={{ display: 'block', fontSize: 10, color: '#64748B' }}>
                              ETB {formatMoney(lineExcise(item))}
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            textAlign: 'right',
                            fontWeight: 700,
                            fontVariantNumeric: 'tabular-nums',
                            color: 'var(--color-navy, #123D2C)',
                          }}
                        >
                          {formatMoney(netLineAmount(item) + lineExcise(item))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial summary + Amount in words */}
              <div className={styles.summarySection}>
                <div>
                  <div className={styles.amountWordsCard}>
                    <p className={styles.amountWordsLabel}>
                      Total amount in words ({language === 'en' ? 'English' : 'አማርኛ'})
                    </p>
                    <p className={styles.amountWordsText}>{words}</p>
                  </div>

                  <div style={{ marginTop: 12, fontSize: 12, color: '#64748B' }}>
                    <b>Payment:</b> {receipt.paymentMethod} ·{' '}
                    {receipt.paymentReference || 'Cash settlement'}
                    {receipt.withholdingTax > 0 && (
                      <p style={{ marginTop: 4, color: 'var(--color-primary-active, #0F766E)', fontWeight: 600 }}>
                        Buyer withholding reference: {receipt.withholdingReference}
                      </p>
                    )}
                  </div>
                </div>

                <dl className={styles.totalsDl}>
                  <div className={styles.totalDlRow}>
                    <dt>Net subtotal:</dt>
                    <dd>ETB {formatMoney(receipt.subtotal)}</dd>
                  </div>
                  <div className={styles.totalDlRow}>
                    <dt>Excise tax:</dt>
                    <dd>ETB {formatMoney(receipt.exciseTax)}</dd>
                  </div>
                  <div className={styles.totalDlRow}>
                    <dt>VAT (15%):</dt>
                    <dd>ETB {formatMoney(receipt.tax)}</dd>
                  </div>
                  {receipt.withholdingTax > 0 && (
                    <div className={styles.totalDlRow} style={{ color: '#0F766E' }}>
                      <dt>Withholding (2%):</dt>
                      <dd>− ETB {formatMoney(receipt.withholdingTax)}</dd>
                    </div>
                  )}
                  <div className={styles.totalDlRowGrand}>
                    <dt>Grand total:</dt>
                    <dd>ETB {formatMoney(receipt.total)}</dd>
                  </div>
                </dl>
              </div>

              {/* MoR Verified QR code */}
              <div className={styles.qrBox}>
                <div className={styles.qrGraphic} aria-label="Official MoR verification QR">
                  {QR_PATTERN.map((isDark, idx) => (
                    <span
                      key={idx}
                      className={isDark ? styles.qrPixelDark : styles.qrPixelLight}
                    />
                  ))}
                </div>

                <div className={styles.qrInfo}>
                  <p className={styles.qrTitle}>
                    <ShieldCheck size={18} /> Official MoR-verified QR code
                  </p>
                  <p className={styles.copy}>
                    Scan using any device or MoR EIMS inspector app to authenticate fiscal clearance.
                  </p>
                  <p className={styles.sigCode}>
                    Digital signature: {receipt.digitalSignature}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.footerLeft}>
            <button
              type="button"
              onClick={() => setLanguage((l) => (l === 'en' ? 'am' : 'en'))}
              className={styles.actionBtn}
            >
              <Languages size={15} />
              <span>{language === 'en' ? 'Show in አማርኛ' : 'Show in English'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintThermal}
              className={styles.actionBtn}
            >
              <Printer size={15} />
              <span>Print 80mm receipt</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className={styles.actionBtn}
            >
              {copied ? <Check size={15} color="#16A34A" /> : <Copy size={15} />}
              <span>{copied ? 'Link copied!' : 'Copy MoR verify link'}</span>
            </button>
          </div>

          <div className={styles.footerRight}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onReset();
              }}
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            >
              <Plus size={15} />
              <span>Create another receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuedReceiptModal;
