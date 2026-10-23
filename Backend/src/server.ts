import app from './app.js';
import { config } from './config/index.js';

const server = app.listen(config.port, () => {
  console.log('====================================================');
  console.log(`🚀 eReceipt MoR EIMS Backend Server is RUNNING`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🏥 Health Check: http://localhost:${config.port}/api/health`);
  console.log(`🧾 Receipts API: http://localhost:${config.port}/api/receipts`);
  console.log(`🔍 TIN Verification: http://localhost:${config.port}/api/tin/verify`);
  console.log(`📦 Products API: http://localhost:${config.port}/api/products`);
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
