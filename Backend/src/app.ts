import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Fani feature routers
import { registrationRouter } from './features/merchant-registration/index.js';
import { officerAuthRouter } from './features/admin/officer-auth/index.js';
import { merchantManagementRouter } from './features/admin/merchant-management/index.js';
import { fiscalOversightRouter } from './features/admin/fiscal-oversight/index.js';

// Domain feature routers from main
import { authRouter } from './modules/auth/auth.routes.js';
import { merchantsRouter } from './modules/merchants/merchants.routes.js';
import { receiptsRouter } from './modules/receipts/receipts.routes.js';
import { auditRouter } from './modules/audit/audit.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app: Application = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded license documents statically
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check endpoints (both /health and /api/health)
app.get(['/health', '/api/health'], (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'eReceipt API Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Info Root
app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'eReceipt Digital Tax & Receipt Management API',
    endpoints: {
      health: '/api/health',
      registration: '/api/registration',
      officerAuth: '/api/admin/auth',
      adminMerchants: '/api/admin/merchants',
      adminFiscal: '/api/admin/fiscal',
      auth: '/api/auth',
      merchants: '/api/merchants',
      receipts: '/api/receipts',
      audit: '/api/audit',
      admin: '/api/admin',
    },
  });
});

// Mount Feature: Merchant Registration
app.use('/api/registration', registrationRouter);

// Mount Feature: Revenue Officer Auth
app.use('/api/admin/auth', officerAuthRouter);

// Mount Feature: Merchant Approvals & Directory
app.use('/api/admin/merchants', merchantManagementRouter);

// Mount Feature: Admin Fiscal Oversight & Audit
app.use('/api/admin/fiscal', fiscalOversightRouter);

// Mount Feature: Domain Modules from main
app.use('/api/auth', authRouter);
app.use('/api/merchants', merchantsRouter);
app.use('/api/receipts', receiptsRouter);
app.use('/api/audit', auditRouter);
app.use('/api/admin', adminRouter);

// 404 & Global Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
