import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';
import { AppError } from './error';

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
    name: err.name,
    fullError: JSON.stringify(err, Object.getOwnPropertyNames(err)),
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
      ...err.metadata
    });
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      details: (err as any).details,
    });
  }

  // Sequelize errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Validation Error',
      details: (err as any).errors?.map((e: any) => ({ message: e.message, field: e.path }))
    });
  }

  // Default to 500
  return res.status(500).json({
    message: 'Internal Server Error'
  });
};