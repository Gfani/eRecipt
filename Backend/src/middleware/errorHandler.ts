import { Request, Response, NextFunction } from "express";
import { AppError } from "../common/errors.js";
import { sendError } from "../common/apiResponse.js";
import { config } from "../config/index.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  console.error("Unhandled Error:", err);

  const message = config.nodeEnv === "production" ? "Internal server error" : err.message;
  sendError(res, message, 500, config.nodeEnv !== "production" ? err.stack : undefined);
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
}
