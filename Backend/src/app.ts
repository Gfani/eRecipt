import express, { Application, Request, Response } from "express";
import cors from "cors";
import { config } from "./config/index.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { merchantsRouter } from "./modules/merchants/merchants.routes.js";
import { receiptsRouter } from "./modules/receipts/receipts.routes.js";
import { auditRouter } from "./modules/audit/audit.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { receiptRoutes } from "./routes/receiptRoutes.js";
import { tinRoutes } from "./routes/tinRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";

const app: Application = express();

// Global Middleware
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());

// Base Health Check
app.get(["/health", "/api/health"], (_req: Request, res: Response) => {
  res.status(200).json({
    status: "online",
    service: "eReceipt API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// API Info Root
app.get("/api", (_req: Request, res: Response) => {
  res.status(200).json({
    name: "eReceipt Digital Tax & Receipt Management API",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      merchants: "/api/merchants",
      receipts: "/api/receipts",
      tin: "/api/tin",
      products: "/api/products",
      audit: "/api/audit",
      admin: "/api/admin",
    },
  });
});

// Domain Feature Routes
app.use("/api/auth", authRouter);
app.use("/api/merchants", merchantsRouter);
app.use("/api/receipts", receiptRoutes);
app.use("/api/receipts", receiptsRouter);
app.use("/api/tin", tinRoutes);
app.use("/api/products", productRoutes);
app.use("/api/audit", auditRouter);
app.use("/api/admin", adminRouter);

// 404 & Global Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
