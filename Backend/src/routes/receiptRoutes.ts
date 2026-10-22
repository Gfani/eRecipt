import { Router } from 'express';
import { ReceiptController } from '../controllers/receiptController.js';

export const receiptRoutes = Router();

// Issuing and calculations
receiptRoutes.post('/issue', ReceiptController.issue);
receiptRoutes.post('/calculate', ReceiptController.calculate);

// Retrieval & verification
receiptRoutes.get('/', ReceiptController.list);
receiptRoutes.get('/verify/:irn', ReceiptController.verify);
receiptRoutes.get('/:id', ReceiptController.getById);
