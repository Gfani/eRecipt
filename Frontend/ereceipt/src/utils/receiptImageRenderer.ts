/**
 * Utility helpers to render, convert, and download receipt visual images
 * Supports SVG vector rendering, Canvas PNG rasterization, and direct file download.
 */

export interface ReceiptImageOptions {
  theme?: 'modern' | 'thermal';
  lang?: 'en' | 'am';
  width?: number;
}

/**
 * Generates a self-contained, lightweight vector SVG receipt image directly on client.
 * Does not depend on server connectivity.
 */
export function generateCompactReceiptSvg(
  receipt: any,
  options: ReceiptImageOptions = {}
): string {
  const isAmharic = options.lang === 'am';
  const width = options.width || 420;
  const items = receipt.items || [];
  const itemsHeight = Math.max(items.length * 20, 24);
  const totalHeight = 380 + itemsHeight;

  const seller = receipt.merchantName || receipt.merchantLegalName || 'Registered Merchant';
  const tin = receipt.merchantTin || 'N/A';
  const buyer = receipt.customerName || (isAmharic ? 'የችርቻሮ ደንበኛ' : 'Walk-in Customer');
  const irn = receipt.irn || 'IRN-EIMS-PENDING';
  const recNo = receipt.receiptNumber || 'REC-OFFICIAL';
  const dateStr = receipt.clearanceTimestamp || new Date().toLocaleString();

  const total = Number(receipt.total || 0).toFixed(2);
  const subtotal = Number(receipt.subtotal || 0).toFixed(2);
  const tax = Number(receipt.tax || 0).toFixed(2);
  const sig = (receipt.digitalSignature || 'SHA256:AUTHENTICATED-EIMS').slice(0, 32);

  const t = isAmharic
    ? {
        country: 'የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ',
        ministry: 'የገቢዎች ሚኒስቴር (MoR)',
        title: 'ህጋዊ የኤሌክትሮኒክስ ደረሰኝ ምስል',
        cleared: '✓ በMoR EIMS የጸደቀ ህጋዊ ደረሰኝ',
        recNo: 'ደረሰኝ ቁ.:',
        irn: 'IRN:',
        date: 'ቀን:',
        buyer: 'ደንበኛ:',
        seller: 'ነጋዴ:',
        tin: 'TIN:',
        items: 'የዕቃ / አገልግሎት ዝርዝር',
        qty: 'ብዛት',
        amt: 'ድምር (ብር)',
        subtotal: 'ንዑስ ድምር:',
        vat: 'ቫት (15%):',
        total: 'ጠቅላላ ክፍያ:',
      }
    : {
        country: 'FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA',
        ministry: 'MINISTRY OF REVENUES (MoR)',
        title: 'OFFICIAL EIMS FISCAL RECEIPT',
        cleared: '✓ FISCAL CLEARED (HTTP 200)',
        recNo: 'RECEIPT NO:',
        irn: 'INVOICE IRN:',
        date: 'DATE:',
        buyer: 'CUSTOMER:',
        seller: 'MERCHANT:',
        tin: 'TIN:',
        items: 'ITEM DESCRIPTION',
        qty: 'QTY',
        amt: 'TOTAL (ETB)',
        subtotal: 'Net Subtotal:',
        vat: 'VAT (15%):',
        total: 'GRAND TOTAL:',
      };

  let itemRowsSvg = '';
  let yPos = 214;
  items.forEach((item: any, idx: number) => {
    const name = (item.name || `Item ${idx + 1}`).slice(0, 24);
    const qty = `${item.qty || 1} ${item.uom || ''}`.trim();
    const lineTotal = Number(item.price ? item.price * (item.qty || 1) : 0).toFixed(2);
    itemRowsSvg += `
      <text x="20" y="${yPos}" font-size="10" fill="#1E293B" font-family="sans-serif">${name}</text>
      <text x="${width / 2 + 20}" y="${yPos}" font-size="10" fill="#475569" text-anchor="middle" font-family="sans-serif">${qty}</text>
      <text x="${width - 20}" y="${yPos}" font-size="10" font-weight="600" fill="#0F172A" text-anchor="end" font-family="monospace">${lineTotal}</text>
    `;
    yPos += 20;
  });

  const totalsY = yPos + 10;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${totalHeight}" width="${width}" height="${totalHeight}">
  <defs>
    <linearGradient id="morTop" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#123D2C" />
      <stop offset="100%" stop-color="#1A5C43" />
    </linearGradient>
  </defs>
  <!-- Background Card -->
  <rect width="${width}" height="${totalHeight}" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
  
  <!-- MoR Header Banner -->
  <path d="M 0 12 Q 0 0 12 0 L ${width - 12} 0 Q ${width} 0 ${width} 12 L ${width} 68 L 0 68 Z" fill="url(#morTop)" />
  <text x="${width / 2}" y="24" text-anchor="middle" font-size="9" font-weight="700" fill="#BBF7D0" letter-spacing="1" font-family="sans-serif">${t.country}</text>
  <text x="${width / 2}" y="42" text-anchor="middle" font-size="13" font-weight="800" fill="#FFFFFF" font-family="sans-serif">${t.ministry}</text>
  <text x="${width / 2}" y="58" text-anchor="middle" font-size="9" font-weight="600" fill="#E2E8F0" font-family="sans-serif">${t.title}</text>

  <!-- Cleared Status Badge -->
  <rect x="20" y="80" width="${width - 40}" height="22" rx="11" fill="#ECFDF5" stroke="#A7F3D0" />
  <text x="${width / 2}" y="95" text-anchor="middle" font-size="10" font-weight="700" fill="#047857" font-family="sans-serif">${t.cleared}</text>

  <!-- Merchant & Receipt Meta -->
  <text x="20" y="122" font-size="12" font-weight="700" fill="#123D2C" font-family="sans-serif">${seller}</text>
  <text x="20" y="138" font-size="9.5" fill="#64748B" font-family="sans-serif">${t.tin} <tspan font-weight="600" fill="#1E293B">${tin}</tspan> | ${t.buyer} <tspan font-weight="600" fill="#1E293B">${buyer}</tspan></text>
  <text x="20" y="154" font-size="9.5" fill="#64748B" font-family="sans-serif">${t.recNo} <tspan font-family="monospace" font-weight="700" fill="#123D2C">${recNo}</tspan></text>
  <text x="20" y="170" font-size="9.5" fill="#64748B" font-family="sans-serif">${t.irn} <tspan font-family="monospace" font-weight="700" fill="#123D2C">${irn}</tspan> · ${dateStr}</text>

  <!-- Items Table Header -->
  <rect x="14" y="184" width="${width - 28}" height="18" rx="4" fill="#F1F5F9" />
  <text x="20" y="196" font-size="8.5" font-weight="700" fill="#475569" font-family="sans-serif">${t.items}</text>
  <text x="${width / 2 + 20}" y="196" font-size="8.5" font-weight="700" fill="#475569" text-anchor="middle" font-family="sans-serif">${t.qty}</text>
  <text x="${width - 20}" y="196" font-size="8.5" font-weight="700" fill="#475569" text-anchor="end" font-family="sans-serif">${t.amt}</text>

  <!-- Items Rows -->
  ${itemRowsSvg}

  <!-- Divider -->
  <line x1="20" y1="${totalsY - 6}" x2="${width - 20}" y2="${totalsY - 6}" stroke="#CBD5E1" stroke-width="1" />

  <!-- Financial Totals -->
  <text x="${width - 140}" y="${totalsY + 12}" font-size="10" fill="#64748B" font-family="sans-serif">${t.subtotal}</text>
  <text x="${width - 20}" y="${totalsY + 12}" font-size="10" font-weight="600" fill="#1E293B" text-anchor="end" font-family="sans-serif">ETB ${subtotal}</text>

  <text x="${width - 140}" y="${totalsY + 28}" font-size="10" fill="#64748B" font-family="sans-serif">${t.vat}</text>
  <text x="${width - 20}" y="${totalsY + 28}" font-size="10" font-weight="600" fill="#1E293B" text-anchor="end" font-family="sans-serif">ETB ${tax}</text>

  <line x1="${width - 160}" y1="${totalsY + 36}" x2="${width - 20}" y2="${totalsY + 36}" stroke="#123D2C" stroke-width="1.5" />

  <text x="${width - 160}" y="${totalsY + 54}" font-size="12" font-weight="800" fill="#123D2C" font-family="sans-serif">${t.total}</text>
  <text x="${width - 20}" y="${totalsY + 54}" font-size="14" font-weight="800" fill="#123D2C" text-anchor="end" font-family="sans-serif">ETB ${total}</text>

  <!-- Digital Signature Footer Box -->
  <rect x="14" y="${totalsY + 70}" width="${width - 28}" height="32" rx="6" fill="#F0FDF4" stroke="#BBF7D0" />
  <text x="22" y="${totalsY + 84}" font-size="8.5" font-weight="700" fill="#166534" font-family="sans-serif">🔐 MoR Digital Stamp · EIMS Verified</text>
  <text x="22" y="${totalsY + 95}" font-size="8" fill="#15803D" font-family="monospace">${sig}...</text>
</svg>`;
}

/**
 * Returns a standalone SVG Data URI for the receipt image
 * Can be encoded directly into QR codes or set as image src.
 */
export function generateReceiptDataUri(
  receipt: any,
  options: ReceiptImageOptions = {}
): string {
  const svg = generateCompactReceiptSvg(receipt, options);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Compresses essential receipt fields into a URL-safe base64 string
 */
export function encodeReceiptForUrl(receipt: any): string {
  try {
    const compact = {
      irn: receipt.irn,
      rec: receipt.receiptNumber,
      sel: receipt.merchantName || receipt.merchantLegalName,
      tin: receipt.merchantTin,
      tot: receipt.total,
      sub: receipt.subtotal,
      tax: receipt.tax,
      buy: receipt.customerName,
      sig: receipt.digitalSignature,
      ts: receipt.clearanceTimestamp,
      itms: (receipt.items || []).map((i: any) => ({
        n: i.name,
        q: i.qty || 1,
        p: i.price || 0,
        u: i.uom || 'PCS',
      })),
    };
    const json = JSON.stringify(compact);
    return btoa(encodeURIComponent(json));
  } catch {
    return '';
  }
}

/**
 * Decodes URL-safe base64 string back into receipt data
 */
export function decodeReceiptFromUrl(encoded: string): any | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const c = JSON.parse(json);
    return {
      irn: c.irn,
      receiptNumber: c.rec,
      merchantName: c.sel,
      merchantTin: c.tin,
      total: c.tot,
      subtotal: c.sub,
      tax: c.tax,
      customerName: c.buy,
      digitalSignature: c.sig,
      clearanceTimestamp: c.ts,
      items: (c.itms || []).map((i: any) => ({
        name: i.n,
        qty: i.q,
        price: i.p,
        uom: i.u,
      })),
    };
  } catch {
    return null;
  }
}

/**
 * Constructs the backend direct image URL for an issued receipt by IRN
 */
export function getReceiptImageUrl(
  irn: string,
  options: ReceiptImageOptions = {},
  baseUrl?: string,
  receipt?: any
): string {
  const host = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const params = new URLSearchParams();
  if (options.theme) params.set('theme', options.theme);
  if (options.lang) params.set('lang', options.lang);
  if (receipt) {
    const data = encodeReceiptForUrl(receipt);
    if (data) params.set('data', data);
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  return `${host}/api/receipts/${encodeURIComponent(irn)}/image${query}`;
}

/**
 * Constructs the frontend standalone receipt image viewer URL for customer QR codes
 */
export function getReceiptViewerUrl(
  irn: string,
  options: ReceiptImageOptions = {},
  baseUrl?: string,
  receipt?: any
): string {
  const host = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const params = new URLSearchParams();
  params.set('view', 'receipt-image');
  params.set('irn', irn);
  if (options.theme) params.set('theme', options.theme);
  if (options.lang) params.set('lang', options.lang);
  if (receipt) {
    const data = encodeReceiptForUrl(receipt);
    if (data) params.set('data', data);
  }

  return `${host}/?${params.toString()}`;
}

/**
 * Converts an SVG string into a raster PNG Data URL using HTML5 Canvas
 */
export async function convertSvgToPngDataUrl(
  svgString: string,
  targetWidth?: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        const width = targetWidth || img.width || 600;
        const scale = width / (img.width || width);
        const height = (img.height || 800) * scale;

        const canvas = document.createElement('canvas');
        canvas.width = width * 2; // 2x retina crispness
        canvas.height = height * 2;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        ctx.scale(2, 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };

      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Triggers a client-side download of a Data URL or Blob with the specified filename
 */
export function downloadImageDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Fetches the backend receipt SVG image and downloads it directly as PNG
 */
export async function downloadReceiptAsPng(
  irn: string,
  options: ReceiptImageOptions = {}
): Promise<void> {
  const imageUrl = getReceiptImageUrl(irn, options);
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch receipt image (${response.status})`);
  }
  const svgText = await response.text();
  const pngDataUrl = await convertSvgToPngDataUrl(svgText);
  const filename = `receipt-${irn.slice(0, 8)}-${Date.now()}.png`;
  downloadImageDataUrl(pngDataUrl, filename);
}
