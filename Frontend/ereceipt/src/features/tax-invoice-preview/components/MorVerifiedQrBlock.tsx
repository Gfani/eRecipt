import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import styles from './MorVerifiedQrBlock.module.css';

export interface MorVerifiedQrBlockProps {
  clearanceUrl?: string;
  irn?: string;
  clearanceDate?: string;
  deviceNumber?: string;
  digitalSignature?: string;
}

export const MorVerifiedQrBlock: React.FC<MorVerifiedQrBlockProps> = ({
  clearanceUrl = 'https://mor.gov.et/eims/verify/IRN-2026-ET-8942109',
  irn = 'IRN-2026-ET-8942109',
  clearanceDate = '2026-10-22 09:42:15 EAT',
  deviceNumber = 'FD-ETH-098231',
  digitalSignature = 'SHA256: 7f8a91b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
}) => {
  return (
    <div className={styles.qrContainer} aria-label="Ministry of Revenues Clearance Verification">
      {/* Generated MoR QR Code */}
      <div className={styles.qrWrapper}>
        <QRCodeSVG
          value={clearanceUrl}
          size={116}
          level="M"
          includeMargin={false}
          title="Scan to verify Ministry of Revenues Tax Invoice Clearance"
        />
      </div>

      {/* Clearance Metadata & Signature */}
      <div className={styles.details}>
        <div className={styles.badge}>
          <ShieldCheck size={13} strokeWidth={2.5} />
          <span>MoR EIMS Cleared</span>
        </div>

        <p className={styles.irnHeading}>
          Invoice Ref No (IRN): <span className={styles.irnValue}>{irn}</span>
        </p>

        <div className={styles.metadataGrid}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Cleared:</span>
            <span className={styles.metaVal}>{clearanceDate}</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Fiscal Device:</span>
            <span className={styles.metaVal}>{deviceNumber}</span>
          </div>
        </div>

        {/* Cryptographic Digital Signature Block */}
        <div className={styles.signature}>
          <span className={styles.sigLabel}>MoR Digital Signature</span>
          <span>{digitalSignature}</span>
        </div>

        <a
          href={clearanceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.clearanceUrl}
        >
          <span>Verify on Ministry of Revenues portal</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

export default MorVerifiedQrBlock;
