import 'dotenv/config';
import { app } from './app.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 eReceipt Backend Server is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Registration API: http://localhost:${PORT}/api/registration`);
  console.log(`=========================================`);
});
