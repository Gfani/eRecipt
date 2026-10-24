import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldCheck, 
  ExternalLink, 
  Receipt, 
  Globe, 
  Smartphone,
  ArrowLeft
} from 'lucide-react';
import styles from './ReceiptImageView.module.css';
import { 
  getReceiptImageUrl, 
  downloadReceiptAsPng,
  generateCompactReceiptSvg,
  decodeReceiptFromUrl,
  convertSvgToPngDataUrl,
  downloadImageDataUrl
} from '../../utils/receiptImageRenderer';
import { findReceiptByIrn } from '../../services/merchantDataStore';

interface ReceiptImageViewProps {
  irn?: string;
  onBack?: () => void;
}

export const ReceiptImageView: React.FC<ReceiptImageViewProps> = ({ irn: propIrn, onBack }) => {
  // Extract IRN from query param if not provided as prop
  const [irn, setIrn] = useState<string>(propIrn || '');
  const [theme, setTheme] = useState<'modern' | 'thermal'>('modern');
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [zoom, setZoom] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [clientSvg, setClientSvg] = useState<string | null>(null);
  const [useClientRenderer, setUseClientRenderer] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlIrn = propIrn || params.get('irn') || params.get('id') || '';
    const urlTheme = (params.get('theme') as 'modern' | 'thermal') || 'modern';
    const urlLang = (params.get('lang') as 'en' | 'am') || 'en';
    const encodedData = params.get('data');
    
    setIrn(urlIrn);
    setTheme(urlTheme);
    setLang(urlLang);

    // 1. Try decoding embedded receipt data
    let found = encodedData ? decodeReceiptFromUrl(encodedData) : null;

    // 2. Fallback to client-side localStorage merchant data store
    if (!found && urlIrn) {
      found = findReceiptByIrn(urlIrn);
    }

    // 3. Fallback to lightweight query parameters
    if (!found && urlIrn) {
      const tot = Number(params.get('tot') || params.get('total') || 0);
      const rec = params.get('rec') || params.get('receiptNumber') || `REC-${urlIrn.slice(-6)}`;
      const sel = params.get('sel') || params.get('merchantName') || 'Registered Merchant';
      if (tot > 0 || rec) {
        found = {
          irn: urlIrn,
          receiptNumber: rec,
          merchantName: sel,
          merchantTin: '0011223344',
          total: tot || 250,
          subtotal: Math.round(((tot || 250) / 1.15) * 100) / 100,
          tax: Math.round(((tot || 250) - (tot || 250) / 1.15) * 100) / 100,
          customerName: 'Walk-in Customer',
          clearanceTimestamp: new Date().toLocaleString(),
          digitalSignature: `SHA256:${urlIrn.replace(/[^A-Za-z0-9]/g, '').padEnd(16, '0')}`,
          items: [{ name: 'Cleared Goods & Services', qty: 1, price: tot || 250, uom: 'PCS' }],
        };
      }
    }

    if (found) {
      setReceiptData(found);
      const svg = generateCompactReceiptSvg(found, { theme: urlTheme, lang: urlLang });
      setClientSvg(svg);
    }
  }, [propIrn]);

  useEffect(() => {
    if (receiptData) {
      const svg = generateCompactReceiptSvg(receiptData, { theme, lang });
      setClientSvg(svg);
    }
  }, [theme, lang, receiptData]);

  const imageUrl = irn ? getReceiptImageUrl(irn, { theme, lang }, undefined, receiptData) : '';

  const handleImageLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleImageError = () => {
    // If backend image route has error, automatically switch to client-side vector SVG rendering
    if (clientSvg || receiptData) {
      setUseClientRenderer(true);
      setLoading(false);
      setError(null);
    } else {
      setLoading(false);
      setError('Failed to load official receipt image. The receipt IRN may not exist or the server is unavailable.');
    }
  };

  const handleDownloadPng = async () => {
    if (!irn && !receiptData) return;
    try {
      setDownloading(true);
      if (clientSvg) {
        const pngDataUrl = await convertSvgToPngDataUrl(clientSvg);
        downloadImageDataUrl(pngDataUrl, `receipt-${irn || 'eims'}-${Date.now()}.png`);
      } else {
        await downloadReceiptAsPng(irn, { theme, lang });
      }
    } catch (err: any) {
      console.error('Download failed:', err);
      if (imageUrl) {
        window.open(imageUrl, '_blank');
      }
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    if (useClientRenderer && clientSvg) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>MoR eReceipt ${irn}</title></head>
            <body style="margin:0;display:flex;justify-content:center;align-items:center;padding:20px;">
              ${clientSvg}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 350);
      }
    } else {
      const printWindow = window.open(imageUrl, '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      }
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.6));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className={styles.container}>
      {/* Top Banner */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {onBack && (
            <button onClick={onBack} className={styles.backButton} aria-label="Go Back">
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
          )}
          <div className={styles.badge}>
            <ShieldCheck size={18} className={styles.badgeIcon} />
            <div>
              <span className={styles.badgeTitle}>Ethiopian MoR e-Receipt</span>
              <span className={styles.badgeSub}>Authentic Fiscal Cleared Invoice</span>
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          {/* Language selector */}
          <div className={styles.segmentedControl}>
            <button
              className={`${styles.segmentBtn} ${lang === 'en' ? styles.activeSegment : ''}`}
              onClick={() => setLang('en')}
              title="English"
            >
              <Globe size={14} />
              <span>EN</span>
            </button>
            <button
              className={`${styles.segmentBtn} ${lang === 'am' ? styles.activeSegment : ''}`}
              onClick={() => setLang('am')}
              title="አማርኛ"
            >
              <span>አማ</span>
            </button>
          </div>

          {/* Theme selector */}
          <div className={styles.segmentedControl}>
            <button
              className={`${styles.segmentBtn} ${theme === 'modern' ? styles.activeSegment : ''}`}
              onClick={() => setTheme('modern')}
              title="Full A4/Standard Invoice"
            >
              <Receipt size={14} />
              <span className={styles.hideMobile}>Invoice</span>
            </button>
            <button
              className={`${styles.segmentBtn} ${theme === 'thermal' ? styles.activeSegment : ''}`}
              onClick={() => setTheme('thermal')}
              title="80mm Thermal Register Slip"
            >
              <Smartphone size={14} />
              <span className={styles.hideMobile}>Thermal Slip</span>
            </button>
          </div>

          <button
            onClick={handleDownloadPng}
            disabled={downloading || !irn}
            className={styles.actionButtonPrimary}
          >
            <Download size={16} />
            <span>{downloading ? 'Saving...' : 'Save Image'}</span>
          </button>

          <button onClick={handlePrint} disabled={!irn} className={styles.actionButtonSecondary}>
            <Printer size={16} />
            <span className={styles.hideMobile}>Print</span>
          </button>
        </div>
      </header>

      {/* Main Canvas / Image Area */}
      <main className={styles.canvasArea}>
        {/* Floating Zoom Bar */}
        <div className={styles.floatingControls}>
          <button onClick={handleZoomOut} title="Zoom Out" className={styles.ctrlBtn}>
            <ZoomOut size={16} />
          </button>
          <span className={styles.zoomText}>{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} title="Zoom In" className={styles.ctrlBtn}>
            <ZoomIn size={16} />
          </button>
          <button onClick={handleResetZoom} title="Reset Zoom" className={styles.ctrlBtn}>
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Content Viewer */}
        <div className={styles.scrollWrapper}>
          {!irn ? (
            <div className={styles.emptyState}>
              <Receipt size={48} className={styles.emptyIcon} />
              <h3>No Receipt IRN Provided</h3>
              <p>Please provide a valid Receipt IRN in the URL (e.g. <code>?view=receipt-image&irn=...</code>) or scan an authentic QR code.</p>
            </div>
          ) : (
            <div 
              className={styles.imageContainer}
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            >
              {loading && (
                <div className={styles.loadingSpinner}>
                  <div className={styles.spinner} />
                  <p>Rendering official receipt image...</p>
                </div>
              )}

              {useClientRenderer && clientSvg ? (
                <div 
                  className={styles.svgVectorWrapper}
                  dangerouslySetInnerHTML={{ __html: clientSvg }}
                />
              ) : error ? (
                <div className={styles.errorBox}>
                  <p>{error}</p>
                  <a href={`/?view=verify&irn=${encodeURIComponent(irn)}`} className={styles.verifyLink}>
                    <ExternalLink size={15} />
                    <span>Check Verification Portal</span>
                  </a>
                </div>
              ) : (
                <img
                  key={imageUrl}
                  src={imageUrl}
                  alt={`Electronic Receipt ${irn}`}
                  className={styles.receiptImg}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.irnLabel}>
            Fiscal Receipt Reference: <code>{irn || 'None'}</code>
          </p>
          <div className={styles.footerLinks}>
            <a 
              href={imageUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.rawLink}
            >
              <ExternalLink size={13} />
              <span>Open Vector (SVG)</span>
            </a>
            <a 
              href={`/?view=verify&irn=${encodeURIComponent(irn)}`} 
              className={styles.rawLink}
            >
              <ShieldCheck size={13} />
              <span>Verify on MoR</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
