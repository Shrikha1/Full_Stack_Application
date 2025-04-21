import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
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
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    logger.warn('No token provided', { path: req.path })
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (decoded.type !== 'access') {
      logger.warn('Invalid token type', { path: req.path, type: decoded.type })
      return res.status(401).json({ message: 'Invalid token type' });
    }
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      logger.warn('User not found', { userId: decoded.userId })
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = {
      id: user.id,
      email: user.email,
    }
    return next();
  } catch (err) {
    logger.warn('Invalid or expired token', { path: req.path })
    return res.status(403).json({ message: 'Invalid or expired token' });
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