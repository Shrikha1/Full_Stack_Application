import { Request, Response, NextFunction } from 'express';
import { User, UserAttributes } from '../models';
import { AppError } from '../utils/error';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/email';
import { Op } from 'sequelize';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

function generateTokens(userId: string, email: string) {
  const accessToken = jwt.sign(
    { id: userId, email, type: 'access' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1d' }
  );
  const refreshToken = jwt.sign(
    { id: userId, email, type: 'refresh' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError(400, 'Email already registered', 'EMAIL_EXISTS');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      email,
      password,
      verified: false,
      verificationToken,
      verificationTokenExpires
    });

    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.'
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    if (!user.verified) {
      throw new AppError(401, 'Please verify your email before logging in. Check your inbox for the verification link.', 'ACCOUNT_NOT_VERIFIED');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const tokens = generateTokens(user.id, user.email);
    
    // Set cookies with proper CORS settings
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none' as const,
      maxAge: 15 * 60 * 1000 // 15 minutes
    };

    res.cookie('accessToken', tokens.accessToken, cookieOptions);
    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
      },
      message: 'Login successful.'
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        verificationToken: token,
        verificationTokenExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      throw new AppError(400, 'Invalid or expired verification token', 'INVALID_TOKEN');
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    if (user.verified) {
      throw new AppError(400, 'Email already verified', 'ALREADY_VERIFIED');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] || req.body.refreshToken;
      if (!refreshToken) {
        throw new AppError(401, 'No refresh token provided', 'NO_REFRESH_TOKEN');
      }
      const payload = jwt.verify(refreshToken, process.env.JWT_SECRET || 'your-secret-key');
      let userId: string | undefined;
      if (typeof payload === 'object' && payload !== null && 'id' in payload) {
        userId = (payload as any).id;
      }
      if (!userId) {
        throw new AppError(401, 'Invalid refresh token', 'INVALID_REFRESH_TOKEN');
      }
      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError(401, 'User not found', 'USER_NOT_FOUND');
      }
      const tokens = generateTokens(user.id, user.email);
      
      // Set cookies with proper CORS settings
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none' as const,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      };

      res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, cookieOptions);
      res.json({
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Refresh token error', { message: (error as Error).message });
      throw new AppError(403, 'Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
    }
  },

  async logout(_req: Request, res: Response) {
    try {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none' as const
      };
      
      res.clearCookie(REFRESH_TOKEN_COOKIE, cookieOptions);
      res.clearCookie('accessToken', cookieOptions);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Logout error', { message: (error as Error).message });
      throw new AppError(500, 'Logout failed', 'LOGOUT_ERROR');
    }
  },

  async getCurrentUser(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.user!.id, {
        attributes: ['id', 'email'],
      });
      if (!user) {
        throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
      }
      res.json({ user });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Get current user error', { message: (error as Error).message });
      throw new AppError(500, 'Failed to get user', 'GET_USER_ERROR');
    }
  },
};