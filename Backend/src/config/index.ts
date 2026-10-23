import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  taxRate: Number(process.env.TAX_RATE) || 0.15, // Standard Ethiopian VAT (15%)
  jwtSecret:
    process.env.JWT_SECRET ||
    (process.env.NODE_ENV === "production" ? "" : "ereceipt-dev-secret-key-change-in-prod"),
  corsOrigin: process.env.CORS_ORIGIN || "*",
  merchantCode: process.env.MERCHANT_CODE || "AM2081",
  branchCode: process.env.BRANCH_CODE || "BOL01",
  registerCode: process.env.REGISTER_CODE || "REG01",
  eimsClearanceMode: process.env.EIMS_CLEARANCE_MODE || "simulation",
  secretKey: process.env.EIMS_SECRET_KEY || "mor-eims-fiscal-secret-key-2026",
};

if (config.nodeEnv === "production" && config.jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 characters in production.");
}
