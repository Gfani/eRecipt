import 'dotenv/config';
import app from './app.js';
import { config } from './config/index.js';

const port = config.port || 5000;

const server = app.listen(port, () => {
  console.log('====================================================');
  console.log(`🚀 eReceipt Backend Server is RUNNING`);
  console.log(`📡 URL: http://localhost:${port}`);
  console.log(`📋 Health Check: http://localhost:${port}/api/health`);
  console.log(`📝 Registration API: http://localhost:${port}/api/registration`);
  console.log(`🔐 Officer Auth: http://localhost:${port}/api/admin/auth`);
  console.log(`🏛️  Merchant Approvals: http://localhost:${port}/api/admin/merchants`);
  console.log(`🧾 Receipts API: http://localhost:${port}/api/receipts`);
  console.log(`🔍 TIN Verification: http://localhost:${port}/api/tin/verify`);
  console.log(`📦 Products API: http://localhost:${port}/api/products`);
  console.log(`⚙️  Mode: ${config.eimsClearanceMode} (Merchant: ${config.merchantCode})`);
  console.log('====================================================');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server gracefully.');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Closing HTTP server gracefully.');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

export default server;
