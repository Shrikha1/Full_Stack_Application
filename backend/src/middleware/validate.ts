import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import { AppError } from '../utils/error';

export const validateRequest = (validations: any[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error: { msg: string }) => error.msg);
      throw new AppError(400, errorMessages.join(', '));
    }

    next();
  };
}; 