import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { User } from '../models'
import { logger } from '../utils/logger'

interface JwtPayload {
  userId: string
  email: string
  type: 'access' | 'refresh'
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
      }
    }
  }
}

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;
  // Check Authorization header (Bearer) or cookie (token)
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    logger.warn('No token provided', { path: req.path })
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = verifyAccessToken(token) as JwtPayload | string;
    if (typeof decoded !== 'object' || decoded.type !== 'access') {
      logger.warn('Invalid token type', { path: req.path })
      return res.status(401).json({ message: 'Invalid token type' });
    }
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      logger.warn('User not found for token', { userId: decoded.userId })
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = { id: user.id, email: user.email };
    return next();
  } catch (err: any) {
    logger.warn('JWT verification failed', { path: req.path, error: err.message })
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = payload as { id: string; email: string };
    next();
    return;
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
}

export const generateTokens = (userId: string, email: string) => {
  const accessToken = jwt.sign(
    { userId, email, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { userId, email, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  )

  return { accessToken, refreshToken }
}

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload
}