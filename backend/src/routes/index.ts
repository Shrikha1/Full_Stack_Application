import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { authController } from '../controllers/auth.controller';
import { salesforceController } from '../controllers/salesforce.controller';

const router = Router();

// Auth routes
router.post('/api/auth/register', authController.register);
router.post('/api/auth/login', authController.login);
router.post('/api/auth/logout', authController.logout);
router.get('/api/auth/session', authenticateToken, authController.getCurrentUser);
router.post('/api/auth/refresh', authController.refreshToken);
router.post('/api/auth/forgot-password', authController.forgotPassword);
router.post('/api/auth/reset-password', authController.resetPassword);

// Protected Salesforce routes
router.get('/api/salesforce/accounts', authenticateToken, salesforceController.getAccounts);
router.get('/api/salesforce/accounts/:id', authenticateToken, salesforceController.getAccount);

export default router;
