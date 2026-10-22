import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: unknown;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Operation successful",
  statusCode = 200
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message = "Resource created successfully"
): void {
  sendSuccess(res, data, message, 201);
}

export function sendError(
  res: Response,
  message = "An error occurred",
  statusCode = 500,
  error?: unknown
): void {
  res.status(statusCode).json({
    success: false,
    message,
    ...(error !== undefined && { error }),
  });
}
