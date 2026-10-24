import { Router } from 'express';
import { ReceiptController } from '../controllers/receiptController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';

export const receiptRoutes = Router();

// Issuing and calculations
receiptRoutes.post('/issue', optionalAuth, ReceiptController.issue);
receiptRoutes.post('/calculate', ReceiptController.calculate);

// Retrieval & verification
receiptRoutes.get('/', requireAuth, ReceiptController.list);
receiptRoutes.get('/verify/:irn', ReceiptController.verify);
receiptRoutes.get('/:irn/image', ReceiptController.getImage);
receiptRoutes.get('/image/:irn', ReceiptController.getImage);
receiptRoutes.get('/:id', requireAuth, ReceiptController.getById);
