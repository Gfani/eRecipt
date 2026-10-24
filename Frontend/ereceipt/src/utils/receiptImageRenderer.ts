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
 * Constructs the backend direct image URL for an issued receipt by IRN
 */
export function getReceiptImageUrl(
  irn: string,
  options: ReceiptImageOptions = {},
  baseUrl?: string
): string {
  const host = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const params = new URLSearchParams();
  if (options.theme) params.set('theme', options.theme);
  if (options.lang) params.set('lang', options.lang);

  const query = params.toString() ? `?${params.toString()}` : '';
  return `${host}/api/receipts/${encodeURIComponent(irn)}/image${query}`;
}

/**
 * Constructs the frontend standalone receipt image viewer URL for customer QR codes
 */
export function getReceiptViewerUrl(
  irn: string,
  options: ReceiptImageOptions = {},
  baseUrl?: string
): string {
  const host = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const params = new URLSearchParams();
  params.set('view', 'receipt-image');
  params.set('irn', irn);
  if (options.theme) params.set('theme', options.theme);
  if (options.lang) params.set('lang', options.lang);

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
