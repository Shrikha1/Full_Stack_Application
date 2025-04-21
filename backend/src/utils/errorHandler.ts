import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export class AppError extends Error {
  status: number;
  code?: string;
  data?: any;
  constructor(status: number, message: string, code?: string, data?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Enhanced debug logging
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    status: (err as any).status,
    code: (err as any).code,
    data: (err as any).data,
    name: err.name,
    fullError: JSON.stringify(err, Object.getOwnPropertyNames(err)),
  });

  if (err instanceof AppError) {
    return res.status(err.status).json({
      message: err.message,
      code: err.code,
      data: err.data
    });
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      details: (err as any).details,
    });
  }

  // Default to 500
  return res.status(500).json({
    message: 'Internal Server Error',
  });
};