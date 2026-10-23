import { Router } from 'express';
import { taxInvoicePreviewController } from '../controllers/taxInvoicePreviewController.js';

export const taxInvoicePreviewRoutes = Router();

taxInvoicePreviewRoutes.get('/:id/clearance-preview', taxInvoicePreviewController.getClearancePreview);
taxInvoicePreviewRoutes.get('/:id/qr-payload', taxInvoicePreviewController.getQrPayload);

export default taxInvoicePreviewRoutes;
