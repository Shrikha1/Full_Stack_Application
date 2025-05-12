import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import { validateAdminToken } from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { registerJoiSchema, loginJoiSchema } from '../validations/auth.joi';

import { logger } from '../utils/logger';
import { prisma } from '../lib/prisma';
import { verifyUserByEmail } from '../utils/email';

const router = Router();

// Public routes
router.post('/register', validate(registerJoiSchema), authController.register);
router.post('/login', validate(loginJoiSchema), authController.login);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.post('/logout', authenticateToken, authController.logout);

// Admin routes - protected with admin token in all environments
// These routes can be used in production with proper authentication
router.get('/admin/verify/:email', validateAdminToken, async (req, res) => {
  try {
    const { email } = req.params;
    const result = await verifyUserByEmail(email);
    
    logger.info(`ADMIN: User ${email} verification attempt`, { success: result.success });
    res.json(result);
  } catch (error) {
    logger.error('Error in admin verification route', { error });
    res.status(500).json({ success: false, message: 'Server error in admin verification' });
  }
});

router.get('/admin/users', validateAdminToken, async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
  select: { id: true, email: true, verified: true, createdAt: true }
});
    res.json({ users });
  } catch (error) {
    logger.error('Error fetching users via admin route', { error });
    res.status(500).json({ message: 'Server error' });
  }
});

// Development only routes - Unprotected for easier testing
if (process.env.NODE_ENV !== 'production') {
  router.get('/dev/verify/:email', async (req, res): Promise<void> => {
    try {
      const { email } = req.params;
      
      // Find the user
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      // Mark as verified
      await prisma.user.update({
  where: { id: user.id },
  data: { verified: true }
});
      
      logger.info(`DEV ROUTE: User ${email} manually verified`);
      
      res.json({ 
        message: 'User verified successfully via dev route', 
        user: { id: user.id, email: user.email, verified: user.verified }
      });
    } catch (error) {
      logger.error('Error in dev verification route', { error });
      res.status(500).json({ message: 'Server error in dev verification route' });
    }
  });
  
  // List all users (DEV ONLY)
  router.get('/dev/users', async (_req, res): Promise<void> => {
    try {
      const users = await prisma.user.findMany({
  select: { id: true, email: true, verified: true, createdAt: true }
});
      res.json({ users });
    } catch (error) {
      logger.error('Error fetching users', { error });
      res.status(500).json({ message: 'Server error' });
    }
  });
}

export default router;