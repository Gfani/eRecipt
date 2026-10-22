import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  taxRate: Number(process.env.TAX_RATE) || 0.15, // Standard Ethiopian VAT (15%)
  jwtSecret: process.env.JWT_SECRET || "ereceipt-dev-secret-key-change-in-prod",
  corsOrigin: process.env.CORS_ORIGIN || "*",
};
