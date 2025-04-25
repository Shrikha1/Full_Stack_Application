import { Request, Response } from 'express';
import { User } from '../models';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errorHandler';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

function generateTokens(userId: string, email: string) {
  const accessToken = signAccessToken({ userId, email, type: 'access' });
  const refreshToken = signRefreshToken({ userId, email, type: 'refresh' });
  return { accessToken, refreshToken };
}

async function sendVerificationEmail(_email: string, verificationLink: string) {
  if (process.env.NODE_ENV === 'development') {
    logger.info(`Verification link: ${verificationLink}`);
  } else {
    // Implement email sending logic here
  }
}

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError(400, 'Email already registered', 'EMAIL_EXISTS');
      }
      const hashed = await bcrypt.hash(password, 10);
      const verificationToken = require('crypto').randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
      await User.create({
        email,
        password: hashed,
        verified: false,
        verificationToken,
        verificationTokenExpires,
      });
      const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
      await sendVerificationEmail(email, verificationLink);
      res.status(201).json({
        message: 'Registration successful. Please check your email to verify your account.'
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Registration error', { message: (error as Error).message });
      throw new AppError(500, 'Registration failed', 'REGISTRATION_ERROR');
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
      }
      if (!user.verified) {
        throw new AppError(401, 'Account not verified. Please check your email for the verification link.', 'ACCOUNT_NOT_VERIFIED');
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
      }
      const tokens = generateTokens(user.id, user.email);
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });
      res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
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
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Login error', { message: (error as Error).message });
      throw new AppError(500, 'Login failed', 'LOGIN_ERROR');
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] || req.body.refreshToken;
      if (!refreshToken) {
        throw new AppError(401, 'No refresh token provided', 'NO_REFRESH_TOKEN');
      }
      const payload = await verifyRefreshToken(refreshToken);
      let userId: string | undefined;
      if (typeof payload === 'object' && payload !== null && 'userId' in payload) {
        userId = (payload as any).userId;
      }
      if (!userId) {
        throw new AppError(401, 'Invalid refresh token', 'INVALID_REFRESH_TOKEN');
      }
      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError(401, 'User not found', 'USER_NOT_FOUND');
      }
      const tokens = generateTokens(user.id, user.email);
      res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
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
      res.clearCookie(REFRESH_TOKEN_COOKIE, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' });
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

  async verifyEmail(req: Request, res: Response) {
    try {
      const { email, token } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user || user.verified || user.verificationToken !== token || !user.verificationTokenExpires || user.verificationTokenExpires < new Date()) {
        throw new AppError(400, 'Invalid or expired verification token', 'INVALID_TOKEN');
      }
      user.verified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();
      res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Email verification error', { message: (error as Error).message });
      throw new AppError(500, 'Email verification failed', 'EMAIL_VERIFICATION_ERROR');
    }
  },
};