import {
  generateCompactReceiptSvg,
  generateReceiptDataUri,
  encodeReceiptForUrl,
  decodeReceiptFromUrl,
} from './receiptImageRenderer';

/**
 * Basic smoke test for receipt image generation and encoding
 */
export function runReceiptImageTests(): boolean {
  const mockReceipt = {
    irn: 'IRN-ET-2026-TEST01',
    receiptNumber: 'AM2081-REG01-2026-0001',
    merchantName: 'Addis Supermarket',
    merchantTin: '0011223344',
    customerName: 'Abebe Kebede',
    total: 1150.0,
    subtotal: 1000.0,
    tax: 150.0,
    clearanceTimestamp: '24 Oct 2026, 21:00 EAT',
    digitalSignature: 'SHA256:TESTSIGNATUREEIMS1234',
    items: [
      { name: 'Coffee 500g', qty: 2, price: 350, uom: 'BAG' },
      { name: 'Tea 100g', qty: 3, price: 150, uom: 'BOX' },
    ],
  };

  // 1. Compact SVG generation
  const svg = generateCompactReceiptSvg(mockReceipt, { lang: 'en' });
  if (!svg.includes('IRN-ET-2026-TEST01') || !svg.includes('1150.00')) {
    console.error('Compact SVG generation test failed');
    return false;
  }

  // 2. Data URI generation
  const dataUri = generateReceiptDataUri(mockReceipt);
  if (!dataUri.startsWith('data:image/svg+xml;charset=utf-8,')) {
    console.error('Data URI generation test failed');
    return false;
  }

  // 3. Roundtrip URL safe encoding
  const encoded = encodeReceiptForUrl(mockReceipt);
  const decoded = decodeReceiptFromUrl(encoded);
  if (!decoded || decoded.irn !== mockReceipt.irn || decoded.total !== mockReceipt.total) {
    console.error('URL roundtrip encoding test failed');
    return false;
  }

  return true;
}
