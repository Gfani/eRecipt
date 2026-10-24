import React, { useState } from 'react';
import {
  Landmark,
  Check,
  CheckCircle2,
  Share2,
  Download,
  Printer,
  Copy,
  Store,
  ExternalLink,
  Eye,
  Plus,
  X,
  Send,
  Languages,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getStoredMerchantProfile } from '../merchant-registration';
import styles from './TaxInvoicePreview.module.css';

interface TaxInvoicePreviewProps {
  onNavigate?: (screen: string) => void;
}

export const TaxInvoicePreview: React.FC<TaxInvoicePreviewProps> = ({ onNavigate }) => {
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState('+251 91 123 4567');
  const [recipientEmail, setRecipientEmail] = useState('customer@hanatrading.et');

  const merchantProfile = getStoredMerchantProfile();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleCopyVerificationLink = () => {
    const url = 'https://eims.mor.gov.et/verify/IRN-ET-2026-884920194';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast(
      language === 'en'
        ? 'MoR verification link copied to clipboard!'
        : 'የMoR ማረጋገጫ ሊንክ ወደ ቅንጥብ ሰሌዳ ተገልብጧል!'
    );
  };

  const handlePrintA4 = () => {
    window.print();
  };

  const handlePrintThermal = () => {
    const printWindow = window.open('', '_blank', 'width=350,height=600');
    if (!printWindow) {
      alert('Please allow popups to print the thermal receipt.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Thermal Receipt - IRN-ET-2026-884920194</title>
          <style>
            @page { margin: 0; size: 80mm auto; }
            body {
              font-family: 'Courier New', monospace;
              width: 72mm;
              margin: 0 auto;
              padding: 12px 6px;
              font-size: 11px;
              color: #000;
            }
            h1 { font-size: 14px; text-align: center; margin: 0; font-weight: bold; }
            p { text-align: center; margin: 3px 0; }
            .rule { border-top: 1px dashed #000; margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; }
            td { padding: 2px 0; vertical-align: top; }
            .total { font-weight: bold; font-size: 12px; }
            .align-right { text-align: right; }
            .center { text-align: center; }
          </style>
        </head>
        <body>
          <h1>Abeba Market PLC</h1>
          <p>Bole Main Outlet · Addis Ababa<br>TIN: 0012345642 | VAT: VAT-ET-0012345642</p>
          <div class="rule"></div>
          <p><b>*** MoR EIMS CLEARED ***</b><br>IRN: IRN-ET-2026-884920194<br>RRN: RRN-ET-2026-441892831<br>20 Oct 2026, 16:01:42 EAT</p>
          <div class="rule"></div>
          <p style="text-align:left;"><b>BUYER:</b> Hana Trading PLC<br>TIN: 0012345678</p>
          <div class="rule"></div>
          <table>
            <tr><td><b>Item</b></td><td class="align-right"><b>Qty</b></td><td class="align-right"><b>Total (ETB)</b></td></tr>
            <tr><td>Sidamo Coffee 500g</td><td class="align-right">1</td><td class="align-right">748.00</td></tr>
            <tr><td>White Teff Grade 1 (25kg)</td><td class="align-right">1</td><td class="align-right">4,500.00</td></tr>
          </table>
          <div class="rule"></div>
          <table>
            <tr><td>Taxable Net:</td><td class="align-right">5,180.00</td></tr>
            <tr><td>VAT (15%):</td><td class="align-right">102.00</td></tr>
            <tr><td>Excise Tax:</td><td class="align-right">68.00</td></tr>
            <tr class="total"><td>GRAND TOTAL ETB:</td><td class="align-right">5,350.00</td></tr>
          </table>
          <div class="rule"></div>
          <p class="center">Scan QR on official invoice to verify online.<br>Cleared in real-time by Ethiopian MoR.</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 350);
  };

  const handleSendShare = (type: string) => {
    setIsShareModalOpen(false);
    showToast(
      language === 'en'
        ? `Invoice document cleared link dispatched via ${type} successfully!`
        : `የደረሰኝ ማረጋገጫ ሰነድ በ${type} በተሳካ ሁኔታ ተልኳል!`
    );
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'am' : 'en'));
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast} role="status">
          <Check size={18} strokeWidth={2.5} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Share Modal Dialog */}
      {isShareModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsShareModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {language === 'en' ? 'Deliver Cleared Tax Invoice' : 'የተረጋገጠ የታክስ ደረሰኝ ላክ'}
              </h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsShareModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ margin: 0, fontSize: '13px', color: '#526059' }}>
                {language === 'en'
                  ? 'Send official electronic fiscal receipt link to the customer without requiring an eReceipt account.'
                  : 'የኢ-ደረሰኝ መለያ ሳያስፈልገው ይፋዊውን የኤሌክትሮኒክ ደረሰኝ ሊንክ ለደንበኛው ይላኩ።'}
              </p>

              <div className={styles.shareInputGroup}>
                <label className={styles.shareLabel}>
                  {language === 'en' ? 'Customer Mobile Phone (SMS)' : 'የደንበኛ ስልክ ቁጥር (ኤስኤምኤስ)'}
                </label>
                <div className={styles.shareInputRow}>
                  <input
                    type="tel"
                    className={styles.shareTextInput}
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.shareSendBtn}
                    onClick={() => handleSendShare('SMS')}
                  >
                    <Send size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    {language === 'en' ? 'Send SMS' : 'ላክ'}
                  </button>
                </div>
              </div>

              <div className={styles.shareInputGroup}>
                <label className={styles.shareLabel}>
                  {language === 'en' ? 'Customer Email Address' : 'የደንበኛ ኢሜይል'}
                </label>
                <div className={styles.shareInputRow}>
                  <input
                    type="email"
                    className={styles.shareTextInput}
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.shareSendBtn}
                    onClick={() => handleSendShare('Email')}
                  >
                    <Send size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    {language === 'en' ? 'Send Email' : 'ላክ'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <header className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <div className={styles.successPill}>
            <CheckCircle2 size={15} strokeWidth={2.5} />
            <span>Submitted successfully · EIMS HTTP 200</span>
          </div>
          <h1 className={styles.title}>
            {language === 'en' ? 'Tax invoice preview' : 'የታክስ ደረሰኝ ቅድመ-እይታ'}
          </h1>
          <p className={styles.subtitle}>
            {language === 'en'
              ? 'The submitted receipt is shown below with its IRN, RRN, digital signature, and verification payload.'
              : 'የገባው ደረሰኝ ከዚህ በታች ከIRN፣ RRN፣ ዲጂታል ፊርማ እና የማረጋገጫ መረጃ ጋር ይታያል።'}
          </p>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.morClearedBadge}>
            <span className={styles.clearedDot} />
            <span>MoR Cleared</span>
          </div>

          <button
            type="button"
            className={styles.langToggleBtn}
            onClick={toggleLanguage}
            title="Toggle between English and Amharic"
          >
            <Languages size={15} />
            <span style={{ fontWeight: language === 'en' ? 700 : 400 }}>English</span>
            <div
              className={`${styles.toggleSwitch} ${
                language === 'am' ? styles.toggleSwitchAmharic : ''
              }`}
            >
              <div
                className={`${styles.toggleThumb} ${
                  language === 'am' ? styles.toggleThumbAmharic : ''
                }`}
              />
            </div>
            <span style={{ fontWeight: language === 'am' ? 700 : 400 }}>አማርኛ</span>
          </button>
        </div>
      </header>

      {/* Main 2-Column Content */}
      <main className={styles.layoutGrid}>
        {/* Left Column: Official Cleared Invoice Document */}
        <article className={styles.documentCard} aria-label="Official Tax Invoice">
          {/* Green Top Ribbon */}
          <div className={styles.morBanner}>
            <div className={styles.morBannerLeft}>
              <div className={styles.morEmblemIcon}>
                <Landmark size={20} />
              </div>
              <div className={styles.morBannerTitles}>
                <span className={styles.morAgency}>MINISTRY OF REVENUES - EIMS</span>
                <span className={styles.morStatusConfirmed}>
                  {language === 'en'
                    ? 'Official real-time clearance confirmed'
                    : 'ይፋዊ የእውነተኛ ጊዜ ማረጋገጫ ተከናውኗል'}
                </span>
              </div>
            </div>

            <div className={styles.morClearedPill}>
              <Check size={14} strokeWidth={3} />
              <span>MoR CLEARED</span>
            </div>
          </div>

          {/* Document Content */}
          <div className={styles.documentBody}>
            {/* Top Seller & Registration Meta */}
            <div className={styles.metaTopRow}>
              {/* Seller Information */}
              <div className={styles.sellerBox}>
                <div className={styles.storeBrandRow}>
                  <div className={styles.storeIconBox}>
                    <Store size={22} />
                  </div>
                  <div>
                    <h2 className={styles.storeTitle}>
                      {merchantProfile.tradeName || 'Abeba Market PLC'}
                    </h2>
                    <p className={styles.storeTradeName}>
                      {language === 'en' ? 'Trade name: Abeba Market' : 'የንግድ ስም፡ አበባ ማርኬት'}
                    </p>
                  </div>
                </div>

                <div className={styles.sellerDetailsGrid}>
                  <span className={styles.sellerLabel}>Seller TIN:</span>
                  <span>{merchantProfile.tin || '0012345642'}</span>

                  <span className={styles.sellerLabel}>Branch:</span>
                  <span>Bole Main Outlet (BOL01)</span>

                  <span className={styles.sellerLabel}>VAT No:</span>
                  <span>VAT-ET-{merchantProfile.tin || '0012345642'}</span>

                  <span className={styles.sellerLabel}>Address:</span>
                  <span>Bole, Woreda 03, House 114</span>

                  <span className={styles.sellerLabel}>GPS Coordinates:</span>
                  <span>8.9806° N, 38.7578° E</span>

                  <span className={styles.sellerLabel}>Cashier:</span>
                  <span>Tigist Getachew</span>

                  <span className={styles.sellerLabel}>Operator ID:</span>
                  <span>CASH-014 / REG01</span>
                </div>
              </div>

              {/* Invoice Registration Identifiers */}
              <div className={styles.invoiceRegBox}>
                <p className={styles.invoiceTypeTitle}>
                  {language === 'en'
                    ? 'ELECTRONIC TAX INVOICE (VAT INVOICE)'
                    : 'የኤሌክትሮኒክ ታክስ ደረሰኝ (የቫት ደረሰኝ)'}
                </p>

                <div className={styles.regField}>
                  <div className={styles.regLabel}>
                    {language === 'en'
                      ? 'Invoice Registration Number (IRN)'
                      : 'የደረሰኝ ምዝገባ ቁጥር (IRN)'}
                  </div>
                  <div className={styles.regValueMonospace}>IRN-ET-2026-884920194</div>
                </div>

                <div className={styles.regField}>
                  <div className={styles.regLabel}>
                    {language === 'en'
                      ? 'Receipt Registration Number (RRN)'
                      : 'የደረሰኝ መለያ ቁጥር (RRN)'}
                  </div>
                  <div className={styles.regValueMonospace}>RRN-ET-2026-441892831</div>
                </div>

                <div className={styles.regField}>
                  <div className={styles.regLabel}>
                    {language === 'en' ? 'Clearance timestamp' : 'የተረጋገጠበት ቀን እና ሰዓት'}
                  </div>
                  <div className={styles.regValueTime}>20 Oct 2026, 16:01:42 EAT</div>
                  <div className={styles.regValueSubtime}>10 Tikimt 2019 E.C.</div>
                </div>
              </div>
            </div>

            {/* Buyer Box */}
            <div className={styles.buyerCard}>
              <p className={styles.buyerEyebrow}>
                {language === 'en' ? 'BUYER / B2B / REGISTERED BUYER' : 'የተመዘገበ ገዢ / ቢዝነስ'}
              </p>
              <h3 className={styles.buyerName}>Hana Trading PLC</h3>
              <div className={styles.buyerDetailsGrid}>
                <div>
                  <span className={styles.buyerLabel}>TIN:</span>
                  <span>0012345678</span>
                </div>
                <div>
                  <span className={styles.buyerLabel}>Fayda FIN:</span>
                  <span>Not provided</span>
                </div>
                <div>
                  <span className={styles.buyerLabel}>VAT:</span>
                  <span>VAT-ET-0012345678</span>
                </div>
                <div>
                  <span className={styles.buyerLabel}>Contact:</span>
                  <span>+251 911 234 567</span>
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className={styles.itemsTableWrapper}>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>
                      {language === 'en' ? 'Code / Item or service' : 'ኮድ / የእቃ ወይም አገልግሎት ስም'}
                    </th>
                    <th className={styles.alignCenter}>
                      {language === 'en' ? 'Qty / UoM' : 'መጠን'}
                    </th>
                    <th className={styles.alignRight}>
                      {language === 'en' ? 'Unit price' : 'ነጠላ ዋጋ'}
                    </th>
                    <th className={styles.alignRight}>
                      {language === 'en' ? 'Discount' : 'ቅናሽ'}
                    </th>
                    <th className={styles.alignCenter}>
                      {language === 'en' ? 'VAT category' : 'የቫት ምድብ'}
                    </th>
                    <th className={styles.alignRight}>
                      {language === 'en' ? 'Excise' : 'ኤክሳይዝ'}
                    </th>
                    <th className={styles.alignRight}>
                      {language === 'en' ? 'Net amount' : 'ጠቅላላ ዋጋ'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className={styles.itemCode}>GR-104</div>
                      <div className={styles.itemDesc}>Sidamo Coffee 500g</div>
                    </td>
                    <td className={styles.alignCenter}>1 PCS</td>
                    <td className={styles.alignRight}>680.00</td>
                    <td className={styles.alignRight}>0.00</td>
                    <td className={styles.alignCenter}>Standard VAT (15%)</td>
                    <td className={styles.alignRight}>10% CTB 68.00</td>
                    <td className={styles.alignRight}>
                      <strong>748.00</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className={styles.itemCode}>ET-042</div>
                      <div className={styles.itemDesc}>White Teff Grade 1 (25kg)</div>
                    </td>
                    <td className={styles.alignCenter}>1 BAG</td>
                    <td className={styles.alignRight}>4,500.00</td>
                    <td className={styles.alignRight}>0.00</td>
                    <td className={styles.alignCenter}>Zero Rated (0%)</td>
                    <td className={styles.alignRight}>0%</td>
                    <td className={styles.alignRight}>
                      <strong>4,500.00</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className={styles.totalsSection}>
              <div className={styles.totalsInWords}>
                <span className={styles.wordsLabel}>
                  {language === 'en' ? 'Amount in Words (ETB)' : 'በፊደል የተገለጸ ጠቅላላ ድምር (ብር)'}
                </span>
                <span className={styles.wordsValue}>
                  {language === 'en'
                    ? 'Five Thousand Three Hundred Fifty Ethiopian Birr and 00/100'
                    : 'አምስት ሺህ ሦስት መቶ ሃምሳ የኢትዮጵያ ብር ከ 00/100 ሳንቲም'}
                </span>
              </div>

              <div className={styles.totalsTable}>
                <div className={styles.totalRow}>
                  <span>{language === 'en' ? 'Subtotal (Net Amount):' : 'ንዑስ ድምር፡'}</span>
                  <span>ETB 5,180.00</span>
                </div>
                <div className={styles.totalRow}>
                  <span>{language === 'en' ? 'Standard VAT (15%):' : 'ቫት (15%)፡'}</span>
                  <span>ETB 102.00</span>
                </div>
                <div className={styles.totalRow}>
                  <span>{language === 'en' ? 'Excise Tax (10%):' : 'የኤክሳይዝ ታክስ (10%)፡'}</span>
                  <span>ETB 68.00</span>
                </div>
                <div className={styles.grandTotalRow}>
                  <span>{language === 'en' ? 'Total Amount Due:' : 'ጠቅላላ ክፍያ፡'}</span>
                  <span className={styles.grandTotalAmount}>ETB 5,350.00</span>
                </div>
              </div>
            </div>

            {/* QR & Verification Section */}
            <div className={styles.qrSection}>
              <div className={styles.qrBox}>
                <QRCodeSVG
                  value="https://eims.mor.gov.et/verify/IRN-ET-2026-884920194"
                  size={108}
                  level="M"
                  includeMargin={false}
                />
              </div>

              <div className={styles.qrMeta}>
                <div className={styles.qrBadge}>
                  <Check size={13} strokeWidth={3} />
                  <span>MoR EIMS Cryptographically Verified</span>
                </div>
                <div className={styles.qrSig}>
                  SHA256: 7f8a91b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8
                </div>
                <a
                  href="https://eims.mor.gov.et/verify/IRN-ET-2026-884920194"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.qrVerifyLink}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopyVerificationLink();
                  }}
                >
                  <span>https://eims.mor.gov.et/verify/IRN-ET-2026-884920194</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Right Column: Action Sidebar */}
        <aside className={styles.actionSidebar}>
          {/* Card 1: Deliver cleared document */}
          <div className={styles.actionCard}>
            <h2 className={styles.actionCardTitle}>Deliver cleared document</h2>
            <p className={styles.actionCardSubtitle}>
              The customer does not need an eReceipt account.
            </p>

            <div className={styles.actionButtonStack}>
              <button
                type="button"
                className={styles.btnSolidPrimary}
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 size={16} />
                <span>Share cleared invoice</span>
              </button>

              <button
                type="button"
                className={styles.btnOutlined}
                onClick={handlePrintA4}
              >
                <Download size={16} />
                <span>Download A4 official PDF</span>
              </button>

              <button
                type="button"
                className={styles.btnOutlined}
                onClick={handlePrintThermal}
              >
                <Printer size={16} />
                <span>Print 80mm thermal receipt</span>
              </button>

              <button
                type="button"
                className={styles.btnOutlined}
                onClick={handleCopyVerificationLink}
              >
                <Copy size={16} />
                <span>Copy MoR verification link</span>
              </button>
            </div>
          </div>

          {/* Card 2: EIMS accepted */}
          <div className={styles.eimsAcceptedCard}>
            <div className={styles.eimsCardHeader}>
              <div className={styles.eimsCheckIcon}>
                <CheckCircle2 size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className={styles.eimsTitle}>EIMS accepted</h3>
                <p className={styles.eimsSub}>API response HTTP 200</p>
              </div>
            </div>

            <div className={styles.eimsDescBox}>
              Cleared in real time and committed to the 10-year statutory archive.
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className={styles.sidebarNavStack}>
            <button
              type="button"
              className={styles.btnCreateAnother}
              onClick={() => onNavigate?.('pos')}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Create another document</span>
            </button>

            <button
              type="button"
              className={styles.btnViewTaxRecord}
              onClick={() => onNavigate?.('sales')}
            >
              <Eye size={16} />
              <span>View tax record</span>
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default TaxInvoicePreview;
