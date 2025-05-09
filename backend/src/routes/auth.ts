import { Router } from 'express';
import { register, login, verifyEmail, resendVerification } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation';
import { registerSchema, loginSchema } from '../schemas/auth';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

export { router as authRouter }; 