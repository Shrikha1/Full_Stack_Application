import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  if ((err as any).statusCode) {
    return res.status((err as any).statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Internal server error' });
};