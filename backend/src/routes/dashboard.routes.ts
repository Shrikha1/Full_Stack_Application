import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { salesforceController } from '../controllers/salesforce.controller';

const router = Router();

// Protect all dashboard routes with JWT auth
router.use(authenticateToken);

// Main dashboard data route (fetch Salesforce accounts)
router.get('/accounts', salesforceController.getAccounts);

export default router;
