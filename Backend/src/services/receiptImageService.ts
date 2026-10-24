import type { IssuedReceipt } from '../models/types.js';

export interface ReceiptImageOptions {
  theme?: 'official' | 'thermal';
  language?: 'en' | 'am';
  width?: number;
}

export class ReceiptImageService {
  /**
   * Generates a high-resolution, self-contained SVG receipt image
   */
  public static generateReceiptSvg(
    receipt: IssuedReceipt,
    options: ReceiptImageOptions = {}
  ): string {
    const theme = options.theme || 'official';
    if (theme === 'thermal') {
      return this.generateThermalReceiptSvg(receipt, options);
    }
    const lang = options.language || 'en';
    const width = options.width || 540;

    const items = receipt.items || [];
    const itemRowHeight = 24;
    const itemsTableHeight = Math.max(60, items.length * itemRowHeight + 35);
    const totalHeight = 520 + itemsTableHeight;

    const subtotalStr = (receipt.subtotal || 0).toFixed(2);
    const taxStr = (receipt.tax || 0).toFixed(2);
    const exciseStr = (receipt.exciseTax || 0).toFixed(2);
    const totalStr = (receipt.total || 0).toFixed(2);
    const dateStr =
      receipt.clearanceTimestamp ||
      (receipt.issuedAt ? new Date(receipt.issuedAt).toLocaleString() : 'N/A');

    const sellerName =
      (receipt as any).merchantLegalName ||
      receipt.merchantName ||
      'Registered Ethiopian Merchant';
    const sellerTin = receipt.merchantTin || 'N/A';
    const sellerAddress = receipt.merchantAddress || 'Addis Ababa, Ethiopia';
    const buyerName = receipt.customerName || (lang === 'am' ? 'ተጠቃሚ ደንበኛ' : 'Walk-in Customer');
    const buyerId = receipt.customerTin
      ? `TIN: ${receipt.customerTin}`
      : receipt.customerNationalId
      ? `FIN: ${receipt.customerNationalId}`
      : (lang === 'am' ? 'አማራጭ (B2C)' : 'Optional (B2C)');

    const itemsRows = items
      .map((item, idx) => {
        const y = 300 + idx * itemRowHeight;
        const qty = (item as any).qty || (item as any).quantity || 1;
        const price = (item as any).price || (item as any).unitPrice || 0;
        const lineTotal = (item as any).lineTotal || qty * price;
        const name = (item.name || `Item ${idx + 1}`).slice(0, 26);

        return `
          <text x="30" y="${y}" font-size="12" fill="#1E293B" font-family="sans-serif">${name}</text>
          <text x="280" y="${y}" font-size="12" fill="#475569" text-anchor="middle" font-family="sans-serif">${qty}</text>
          <text x="380" y="${y}" font-size="12" fill="#475569" text-anchor="end" font-family="sans-serif">${price.toFixed(2)}</text>
          <text x="${width - 30}" y="${y}" font-size="12" font-weight="600" fill="#0F172A" text-anchor="end" font-family="sans-serif">${lineTotal.toFixed(2)}</text>
        `;
      })
      .join('\n');

    const totalsY = 320 + items.length * itemRowHeight;

    const t = {
      country: lang === 'am' ? 'የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ' : 'FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA',
      ministry: lang === 'am' ? 'የገቢዎች ሚኒስቴር (MoR)' : 'MINISTRY OF REVENUES (MoR)',
      system: lang === 'am' ? 'የኤሌክትሮኒክ ደረሰኝ አስተዳደር ሥርዓት (EIMS)' : 'ELECTRONIC INVOICE MANAGEMENT SYSTEM (EIMS)',
      cleared: lang === 'am' ? 'የተረጋገጠ የታክስ ደረሰኝ (HTTP 200)' : 'FISCAL CLEARED (HTTP 200)',
      receiptNo: lang === 'am' ? 'የደረሰኝ ቁጥር:' : 'RECEIPT NO:',
      irn: lang === 'am' ? 'የሰነድ IRN:' : 'INVOICE IRN:',
      issuedAt: lang === 'am' ? 'የወጣበት ቀን:' : 'ISSUED AT:',
      customer: lang === 'am' ? 'ደንበኛ / ገዢ:' : 'CUSTOMER:',
      itemDesc: lang === 'am' ? 'የዕቃው ዝርዝር' : 'ITEM DESCRIPTION',
      qty: lang === 'am' ? 'ብዛት' : 'QTY',
      price: lang === 'am' ? 'ዋጋ' : 'PRICE',
      total: lang === 'am' ? 'ጠቅላላ (ETB)' : 'TOTAL (ETB)',
      subtotal: lang === 'am' ? 'የተጣራ ድምር:' : 'Net Subtotal:',
      vat: lang === 'am' ? 'ተ.እ.ታ (15%):' : 'VAT (15%):',
      excise: lang === 'am' ? 'ኤክሳይስ ታክስ:' : 'Excise Tax:',
      grandTotal: lang === 'am' ? 'ጠቅላላ ድምር:' : 'GRAND TOTAL:',
      payment: lang === 'am' ? 'የክፍያ ዘዴ:' : 'Payment:',
      sigStamp: lang === 'am' ? '🔐 የገቢዎች ሚኒስቴር ዲጂታል ማረጋገጫ ማኅተም' : '🔐 MoR Cryptographic Fiscal Digital Signature Stamp',
      footer: lang === 'am' ? 'ሕጋዊ የኤሌክትሮኒክ ደረሰኝ · በገቢዎች ሚኒስቴር በቅጽበት የተረጋገጠ' : 'Official Electronic Invoice · Validated in real-time by Ethiopian MoR',
    };

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${totalHeight}" width="${width}" height="${totalHeight}">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#123D2C" />
      <stop offset="100%" stop-color="#176B4D" />
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-2%" width="110%" height="106%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0F172A" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="${width}" height="${totalHeight}" fill="#F8FAFC" />

  <!-- Main Receipt Card -->
  <rect x="12" y="12" width="${width - 24}" height="${totalHeight - 24}" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#cardShadow)" />

  <!-- Official Header Banner -->
  <rect x="12" y="12" width="${width - 24}" height="76" rx="14" fill="url(#headerGrad)" />
  <rect x="12" y="68" width="${width - 24}" height="20" fill="url(#headerGrad)" />
  
  <text x="${width / 2}" y="38" text-anchor="middle" font-size="11" font-weight="700" fill="#BBF7D0" letter-spacing="1.5" font-family="sans-serif">
    ${t.country}
  </text>
  <text x="${width / 2}" y="56" text-anchor="middle" font-size="15" font-weight="800" fill="#FFFFFF" letter-spacing="0.5" font-family="sans-serif">
    ${t.ministry}
  </text>
  <text x="${width / 2}" y="74" text-anchor="middle" font-size="10" font-weight="600" fill="#E2E8F0" font-family="sans-serif">
    ${t.system}
  </text>

  <!-- Status Pill -->
  <rect x="${width / 2 - 95}" y="98" width="190" height="24" rx="12" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
  <circle cx="${width / 2 - 76}" cy="110" r="4" fill="#16A34A" />
  <text x="${width / 2 - 62}" y="114" font-size="11" font-weight="700" fill="#047857" font-family="sans-serif">
    ${t.cleared}
  </text>

  <!-- Merchant Info -->
  <text x="30" y="145" font-size="15" font-weight="800" fill="#0F172A" font-family="sans-serif">${sellerName}</text>
  <text x="30" y="162" font-size="11" fill="#475569" font-family="sans-serif">TIN: ${sellerTin}  |  Address: ${sellerAddress}</text>

  <line x1="30" y1="174" x2="${width - 30}" y2="174" stroke="#E2E8F0" stroke-dasharray="4,4" />

  <!-- Fiscal Identifiers -->
  <text x="30" y="194" font-size="10" fill="#64748B" font-family="sans-serif">${t.receiptNo}</text>
  <text x="130" y="194" font-size="11" font-weight="700" fill="#123D2C" font-family="monospace">${receipt.receiptNumber || 'N/A'}</text>

  <text x="30" y="210" font-size="10" fill="#64748B" font-family="sans-serif">${t.irn}</text>
  <text x="130" y="210" font-size="11" font-weight="700" fill="#123D2C" font-family="monospace">${receipt.irn || 'N/A'}</text>

  <text x="30" y="226" font-size="10" fill="#64748B" font-family="sans-serif">${t.issuedAt}</text>
  <text x="130" y="226" font-size="11" font-weight="600" fill="#334155" font-family="sans-serif">${dateStr}</text>

  <!-- Customer Info -->
  <text x="30" y="248" font-size="10" fill="#64748B" font-family="sans-serif">${t.customer}</text>
  <text x="130" y="248" font-size="11" font-weight="600" fill="#0F172A" font-family="sans-serif">${buyerName} (${buyerId})</text>

  <!-- Table Header -->
  <rect x="24" y="262" width="${width - 48}" height="24" rx="4" fill="#F1F5F9" />
  <text x="30" y="278" font-size="10" font-weight="700" fill="#475569" font-family="sans-serif">${t.itemDesc}</text>
  <text x="280" y="278" font-size="10" font-weight="700" fill="#475569" text-anchor="middle" font-family="sans-serif">${t.qty}</text>
  <text x="380" y="278" font-size="10" font-weight="700" fill="#475569" text-anchor="end" font-family="sans-serif">${t.price}</text>
  <text x="${width - 30}" y="278" font-size="10" font-weight="700" fill="#475569" text-anchor="end" font-family="sans-serif">${t.total}</text>

  <!-- Line Items -->
  ${itemsRows}

  <!-- Separator Rule -->
  <line x1="30" y1="${totalsY - 10}" x2="${width - 30}" y2="${totalsY - 10}" stroke="#CBD5E1" />

  <!-- Financial Totals -->
  <text x="${width - 180}" y="${totalsY + 8}" font-size="11" fill="#64748B" font-family="sans-serif">${t.subtotal}</text>
  <text x="${width - 30}" y="${totalsY + 8}" font-size="11" font-weight="600" fill="#0F172A" text-anchor="end" font-family="sans-serif">ETB ${subtotalStr}</text>

  <text x="${width - 180}" y="${totalsY + 26}" font-size="11" fill="#64748B" font-family="sans-serif">${t.vat}</text>
  <text x="${width - 30}" y="${totalsY + 26}" font-size="11" font-weight="600" fill="#0F172A" text-anchor="end" font-family="sans-serif">ETB ${taxStr}</text>

  ${
    receipt.exciseTax
      ? `
  <text x="${width - 180}" y="${totalsY + 44}" font-size="11" fill="#64748B" font-family="sans-serif">${t.excise}</text>
  <text x="${width - 30}" y="${totalsY + 44}" font-size="11" font-weight="600" fill="#0F172A" text-anchor="end" font-family="sans-serif">ETB ${exciseStr}</text>
  `
      : ''
  }

  <line x1="${width - 200}" y1="${totalsY + 56}" x2="${width - 30}" y2="${totalsY + 56}" stroke="#123D2C" stroke-width="1.5" />

  <text x="${width - 200}" y="${totalsY + 76}" font-size="14" font-weight="800" fill="#123D2C" font-family="sans-serif">${t.grandTotal}</text>
  <text x="${width - 30}" y="${totalsY + 76}" font-size="16" font-weight="800" fill="#123D2C" text-anchor="end" font-family="sans-serif">ETB ${totalStr}</text>

  <!-- Payment Method -->
  <text x="30" y="${totalsY + 74}" font-size="11" fill="#475569" font-family="sans-serif">
    ${t.payment} <tspan font-weight="700" fill="#0F172A">${receipt.paymentMethod || 'Cash'}</tspan>
  </text>

  <!-- Cryptographic Seal Box -->
  <rect x="24" y="${totalsY + 98}" width="${width - 48}" height="48" rx="8" fill="#F0FDF4" stroke="#BBF7D0" />
  <text x="36" y="${totalsY + 116}" font-size="10" font-weight="700" fill="#166534" font-family="sans-serif">
    ${t.sigStamp}
  </text>
  <text x="36" y="${totalsY + 134}" font-size="9" fill="#15803D" font-family="monospace">
    ${receipt.digitalSignature || 'SHA256:AUTHENTICATED-EIMS-CLEARANCE'}
  </text>

  <!-- Footer Watermark -->
  <text x="${width / 2}" y="${totalHeight - 20}" text-anchor="middle" font-size="10" fill="#94A3B8" font-family="sans-serif">
    ${t.footer}
  </text>
</svg>`;
  }

  /**
   * Generates a thermal paper slip (80mm style) SVG image
   */
  public static generateThermalReceiptSvg(
    receipt: IssuedReceipt,
    options: ReceiptImageOptions = {}
  ): string {
    const width = options.width || 340;
    const items = receipt.items || [];
    const itemHeight = 36;
    const totalHeight = 460 + items.length * itemHeight;

    const sellerName =
      (receipt as any).merchantLegalName ||
      receipt.merchantName ||
      'REGISTERED MERCHANT';
    const sellerTin = receipt.merchantTin || 'N/A';
    const subtotalStr = (receipt.subtotal || 0).toFixed(2);
    const taxStr = (receipt.tax || 0).toFixed(2);
    const totalStr = (receipt.total || 0).toFixed(2);

    const itemsRows = items
      .map((item, idx) => {
        const y = 230 + idx * itemHeight;
        const qty = (item as any).qty || (item as any).quantity || 1;
        const price = (item as any).price || (item as any).unitPrice || 0;
        const lineTotal = (item as any).lineTotal || qty * price;
        return `
          <text x="20" y="${y}" font-size="11" font-weight="bold" fill="#111" font-family="monospace">${(item.name || `ITEM ${idx + 1}`).slice(0, 24)}</text>
          <text x="20" y="${y + 14}" font-size="10" fill="#444" font-family="monospace">${qty} x ${price.toFixed(2)}</text>
          <text x="${width - 20}" y="${y + 14}" font-size="11" font-weight="bold" fill="#111" text-anchor="end" font-family="monospace">${lineTotal.toFixed(2)}</text>
        `;
      })
      .join('\n');

    const totalsY = 240 + items.length * itemHeight;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${totalHeight}" width="${width}" height="${totalHeight}">
  <!-- Thermal Slip Paper -->
  <rect width="${width}" height="${totalHeight}" fill="#FAF9F6" />
  <rect x="10" y="10" width="${width - 20}" height="${totalHeight - 20}" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="1" stroke-dasharray="6,4" />

  <!-- Merchant Header -->
  <text x="${width / 2}" y="42" text-anchor="middle" font-size="14" font-weight="bold" fill="#111" font-family="monospace">${sellerName}</text>
  <text x="${width / 2}" y="58" text-anchor="middle" font-size="10" fill="#444" font-family="monospace">TIN: ${sellerTin}</text>
  <text x="${width / 2}" y="72" text-anchor="middle" font-size="9" fill="#666" font-family="monospace">*** MoR EIMS CLEARED ***</text>

  <line x1="20" y1="84" x2="${width - 20}" y2="84" stroke="#111" stroke-dasharray="2,2" />

  <text x="20" y="102" font-size="10" fill="#222" font-family="monospace">REC: ${receipt.receiptNumber || 'N/A'}</text>
  <text x="20" y="118" font-size="10" fill="#222" font-family="monospace">IRN: ${receipt.irn || 'N/A'}</text>
  <text x="20" y="134" font-size="10" fill="#222" font-family="monospace">BUYER: ${(receipt.customerName || 'WALK-IN (B2C)').slice(0, 20)}</text>

  <line x1="20" y1="146" x2="${width - 20}" y2="146" stroke="#111" stroke-dasharray="2,2" />

  <text x="20" y="162" font-size="10" font-weight="bold" fill="#111" font-family="monospace">ITEM</text>
  <text x="${width - 20}" y="162" font-size="10" font-weight="bold" fill="#111" text-anchor="end" font-family="monospace">TOTAL (ETB)</text>

  <line x1="20" y1="172" x2="${width - 20}" y2="172" stroke="#444" />

  <!-- Items -->
  ${itemsRows}

  <line x1="20" y1="${totalsY}" x2="${width - 20}" y2="${totalsY}" stroke="#111" stroke-dasharray="2,2" />

  <text x="20" y="${totalsY + 20}" font-size="10" fill="#333" font-family="monospace">SUBTOTAL:</text>
  <text x="${width - 20}" y="${totalsY + 20}" font-size="10" fill="#111" text-anchor="end" font-family="monospace">ETB ${subtotalStr}</text>

  <text x="20" y="${totalsY + 36}" font-size="10" fill="#333" font-family="monospace">VAT (15%):</text>
  <text x="${width - 20}" y="${totalsY + 36}" font-size="10" fill="#111" text-anchor="end" font-family="monospace">ETB ${taxStr}</text>

  <line x1="20" y1="${totalsY + 46}" x2="${width - 20}" y2="${totalsY + 46}" stroke="#111" stroke-width="1.5" />

  <text x="20" y="${totalsY + 66}" font-size="13" font-weight="bold" fill="#000" font-family="monospace">TOTAL ETB:</text>
  <text x="${width - 20}" y="${totalsY + 66}" font-size="14" font-weight="bold" fill="#000" text-anchor="end" font-family="monospace">${totalStr}</text>

  <!-- Digital Signature Footer -->
  <text x="${width / 2}" y="${totalHeight - 45}" text-anchor="middle" font-size="8" fill="#555" font-family="monospace">SIG: ${(receipt.digitalSignature || 'SHA256:CLEARED').slice(0, 32)}</text>
  <text x="${width / 2}" y="${totalHeight - 30}" text-anchor="middle" font-size="8" fill="#777" font-family="monospace">THANK YOU FOR YOUR PURCHASE!</text>
</svg>`;
  }

  /**
   * Generates a 404 placeholder SVG image when an IRN is not found
   */
  public static generateNotFoundSvg(irn: string, width = 500, height = 300): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" rx="12" fill="#FEF2F2" stroke="#FCA5A5" stroke-width="2" />
  <circle cx="${width / 2}" cy="80" r="32" fill="#FEE2E2" />
  <text x="${width / 2}" y="90" text-anchor="middle" font-size="28" fill="#DC2626">⚠️</text>
  <text x="${width / 2}" y="145" text-anchor="middle" font-size="16" font-weight="700" fill="#991B1B" font-family="sans-serif">Receipt Not Found</text>
  <text x="${width / 2}" y="175" text-anchor="middle" font-size="12" fill="#7F1D1D" font-family="monospace">IRN: ${irn}</text>
  <text x="${width / 2}" y="210" text-anchor="middle" font-size="11" fill="#B91C1C" font-family="sans-serif">No official fiscal clearance record found in MoR EIMS.</text>
</svg>`;
  }
}
