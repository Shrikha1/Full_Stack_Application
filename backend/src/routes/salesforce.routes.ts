import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { salesforceController } from '../controllers/salesforce.controller';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting configuration
const salesforceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all Salesforce routes
router.use(salesforceLimiter);

// Protected routes - require authentication
router.use(authenticateToken);

// Account routes
router.get('/accounts', salesforceController.getAccounts);

export default router;