import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate.middleware';
import { registerJoiSchema, loginJoiSchema } from '../validations/auth.joi';

const router = Router();

// Public routes
router.post('/register', validate(registerJoiSchema), authController.register);
router.post('/login', validate(loginJoiSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.post('/logout', authenticateToken, authController.logout);

export default router;