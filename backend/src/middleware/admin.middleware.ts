import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';
import { logger } from '../utils/logger';

// Simple admin middleware using an environment variable token for basic protection
export const validateAdminToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the admin token from the request
    const adminToken = req.headers['x-admin-token'] as string;
    
    // Check if the ADMIN_SECRET env variable is set
    const adminSecret = process.env.ADMIN_SECRET;
    
    // If no admin secret is set, this feature is disabled
    if (!adminSecret) {
      logger.warn('Admin routes accessed but ADMIN_SECRET not configured');
      throw new AppError(403, 'Admin functionality is disabled', true);
    }
    
    // Validate the provided token
    if (!adminToken || adminToken !== adminSecret) {
      logger.warn('Invalid admin token used', { 
        ip: req.ip,
        path: req.path
      });
      throw new AppError(403, 'Invalid admin credentials', true);
    }
    
    // Token is valid, proceed to the route
    logger.info('Admin access granted', { path: req.path });
    next();
  } catch (error) {
    next(error);
  }
};
