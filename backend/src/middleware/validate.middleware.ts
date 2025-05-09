import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/error';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      throw new AppError(400, 'Validation error', true, { code: 'VALIDATION_ERROR', details: errors });
    }
    next();
  };
};