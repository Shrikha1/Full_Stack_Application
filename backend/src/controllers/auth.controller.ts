import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const emailRegex = /^[^\s@]+@[^]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' });
      }
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
      }
      await User.create({ email, password });
      return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );
      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
};

import { User } from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' });
      }
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
      }
      await User.create({ email, password });
      return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );
      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
};

import { User } from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const emailRegex = /^[^\s@]+@[^\\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' });
      }
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
      }
      await User.create({ email, password });
      return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );
      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
};

import { User } from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' });
      }
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
      }
      await User.create({ email, password });
      return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );
      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
};

import { User } from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' });
      }
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
      }
      await User.create({ email, password });
      return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );
      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
};

import { User } from '../models';
import { AppError } from '../utils/error';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/email';
import { Op } from 'sequelize';
import { SalesforceService } from '../services/salesforce';

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

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, salesforceUsername, salesforcePassword } = req.body;

      if (!email || !password || !salesforceUsername || !salesforcePassword) {
        throw new AppError(400, 'All fields are required: email, password, salesforceUsername, salesforcePassword', true);
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError(400, 'Email already registered', true);
      }

      // Verify Salesforce credentials
      const salesforceService = new SalesforceService();
      try {
        const sfAuth = await salesforceService.authenticate(salesforceUsername, salesforcePassword);
        if (!sfAuth.success) {
          throw new AppError(400, 'Invalid Salesforce credentials', true);
        }
      } catch (error) {
        logger.error('Salesforce authentication failed during registration:', error);
        throw new AppError(400, 'Invalid Salesforce credentials', true);
      }

      // Create user with Salesforce credentials
      await User.create({
        email,
        password,
        salesforceUsername,
        salesforcePassword
      });

      // Send verification email
      const emailResult = await sendVerificationEmail(email, verificationToken);
      
      // For development environment, include verification details in response
      const response: any = {
        message: 'Registration successful. Please check your email to verify your account.'
      };

      // Include verification details only in development mode
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
if (process.env.NODE_ENV !== 'production' && !process.env.RENDER) {
  // Log verification details for debugging
  logger.info('=== VERIFICATION DETAILS ===');
  logger.info(`Email: ${email}`);
  logger.info(`Token: ${verificationToken}`);
  logger.info(`Verify Link: ${verificationLink}`);
  logger.info('================================');
  response.devInfo = {
    verificationToken,
    verificationLink,
    emailSent: emailResult?.success,
    manualVerifyUrl: `${req.protocol}://${req.get('host')}/api/auth/dev/verify/${encodeURIComponent(email)}`,
    message: 'These details are only included in development mode'
  };
}
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new AppError(401, 'Invalid email or password', true);
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new AppError(401, 'Invalid email or password', true);
      }

      // Verify Salesforce credentials
      const salesforceService = new SalesforceService();
      try {
        const sfAuth = await salesforceService.authenticate(user.salesforceUsername, user.salesforcePassword);
        if (!sfAuth.success) {
          throw new AppError(401, 'Invalid Salesforce credentials', true);
        }
      } catch (error) {
        logger.error('Salesforce authentication failed:', error);
        throw new AppError(401, 'Invalid Salesforce credentials', true);
      }

      // Check if email verification is enforced
      const enforcedDate = new Date('2025-06-15T00:00:00Z'); // Future date when verification will be required
      const currentDate = new Date();
      
      // Skip verification if:
      // 1. SKIP_EMAIL_VERIFICATION environment variable is set to 'true' OR
      // 2. We're before the enforcement date (temporary override for production)
      const skipVerification = 
        process.env.SKIP_EMAIL_VERIFICATION === 'true' || 
        currentDate < enforcedDate;
      
      // Control whether to show verification options in errors
      const showVerifyOptions = 
        process.env.NODE_ENV !== 'production' || 
        process.env.SHOW_VERIFY_OPTIONS === 'true';
      
      // Log the verification bypass
      if (!user.verified && skipVerification) {
        logger.info(`Verification bypassed for user ${user.email} - bypass active until ${enforcedDate.toISOString()}`);
      }
      
      if (!user.verified && !skipVerification) {
        // If not verified and verification is not skipped, reject login
        const message = 'Please verify your email before logging in. Check your inbox for the verification link.';
        
        if (showVerifyOptions) {
          // For development or if explicitly enabled, provide verification options in error
          logger.info(`LOGIN ATTEMPT: Unverified user ${user.email} - providing verification options`);
          throw new AppError(401, message, true, {
            code: 'ACCOUNT_NOT_VERIFIED',
            verifyOptions: {
              email: user.email,
              manualVerifyUrl: `${req.protocol}://${req.get('host')}/api/auth/dev/verify/${user.email}`,
              resendUrl: `${req.protocol}://${req.get('host')}/api/auth/resend-verification`
            }
          });
        } else {
          throw new AppError(401, message, true);
        }
      }

      // Generate tokens
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

      // Get Salesforce user info
      const sfUserInfo = await salesforceService.getUserInfo();

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          salesforceInfo: sfUserInfo
        },
        message: 'Login successful.'
      });
    } catch (error) {
      next(error);
    }
  },

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        where: {
          verificationToken: token,
          verificationTokenExpires: { [Op.gt]: new Date() }
        }
      });

      if (!user) {
        throw new AppError(400, 'Invalid or expired verification token', true);
      }

      user.verified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      next(error);
    }
  },

  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new AppError(404, 'User not found', true);
      }

      if (user.verified) {
        throw new AppError(400, 'Email already verified', true);
      }

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Update user with new verification token
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = verificationTokenExpires;
      await user.save();

      // Send verification email
      const emailResult = await sendVerificationEmail(email, verificationToken);
      if (!emailResult.success) {
        // If email sending fails, revert the token changes
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        throw new AppError(500, 'Failed to send verification email', true, {
          error: emailResult.message,
          code: 'EMAIL_SEND_FAILED'
        });
      }

      res.json({ message: 'Verification email sent successfully' });
    } catch (error) {
      logger.error('Error in resendVerification:', {
        error: error.message,
        stack: error.stack,
        email: req.body.email
      });
      next(error);
    }
  }

      await sendVerificationEmail(email, verificationToken);

      res.json({ message: 'Verification email sent' });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        // Don't reveal whether the email exists for security reasons
        return res.json({ message: 'If an account exists with this email, a password reset link has been sent' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

      user.resetToken = resetToken;
      user.resetTokenExpires = resetTokenExpires;
      await user.save();

      // Send reset password email
      await sendForgotPasswordEmail(email, resetToken);

      res.json({ message: 'Password reset link has been sent to your email' });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;

      const user = await User.findOne({
        where: {
          resetToken: token,
          resetTokenExpires: { [Op.gt]: new Date() }
        }
      });

      if (!user) {
        throw new AppError(400, 'Invalid or expired password reset token', true);
      }

      // Clear reset token and update password
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      user.password = password;
      await user.save();

      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] || req.body.refreshToken;
      if (!refreshToken) {
        throw new AppError(401, 'No refresh token provided', true);
      }
      const payload = jwt.verify(refreshToken, process.env.JWT_SECRET || 'your-secret-key');
      let userId: string | undefined;
      if (typeof payload === 'object' && payload !== null && 'id' in payload) {
        userId = (payload as any).id;
      }
      if (!userId) {
        throw new AppError(401, 'Invalid refresh token', true);
      }
      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError(401, 'User not found', true);
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
      throw new AppError(403, 'Invalid or expired refresh token', true);
    }
  },

  async logout(req: Request, res: Response) {
    // Always handle logout requests even if no token exists
    try {
      const hasRefreshToken = req.cookies && req.cookies[REFRESH_TOKEN_COOKIE];
      const hasAccessToken = req.cookies && req.cookies.accessToken;
      
      // Log attempt for debugging
      if (!hasRefreshToken && !hasAccessToken) {
        // Just log at debug level, as this isn't really an error
        logger.debug('Logout attempt with no tokens', { 
          path: req.path, 
          cookies: Object.keys(req.cookies || {}),
          ip: req.ip 
        });
      }
      
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none' as const
      };
      
      // Clear cookies regardless of whether they exist
      res.clearCookie(REFRESH_TOKEN_COOKIE, cookieOptions);
      res.clearCookie('accessToken', cookieOptions);
      
      // Always return success
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      // Log but don't throw - always succeed logout
      logger.error('Logout error', { message: (error as Error).message });
      res.status(200).json({ message: 'Logged out successfully' });
    }
  },

  async getCurrentUser(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.user!.id, {
        attributes: ['id', 'email'],
      });
      if (!user) {
        throw new AppError(404, 'User not found', true);
      }
      res.json({ user });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Get current user error', { message: (error as Error).message });
      throw new AppError(500, 'Failed to get user', true);
    }
  },
};