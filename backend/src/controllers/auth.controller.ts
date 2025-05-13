import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/email';

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
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          verified: false,
          verificationToken,
          verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        },
      });

      // Send verification email
      try {
        const emailResult = await sendVerificationEmail(email, verificationToken);
        console.log('Verification email result:', emailResult);
        return res.status(201).json({
          message: 'User registered successfully. Please check your email for verification link.',
          verificationLink: process.env.NODE_ENV === 'development' ? emailResult.verificationLink : undefined
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        return res.status(201).json({
          message: 'User registered but verification email could not be sent. Please contact support.'
        });
      }
    } catch (error) {
      next(error);
      return;
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      );
      return res.status(200).json({ token });
    } catch (error) {
      next(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      if (!token) {
        return res.status(400).json({ message: 'Verification token is required' });
      }

      const user = await prisma.user.findFirst({
        where: {
          verificationToken: token,
          verificationTokenExpires: {
            gt: new Date()
          }
        }
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired verification token' });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          verified: true,
          verificationToken: null,
          verificationTokenExpires: null
        }
      });

      return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      next(error);
    }
  },
  async resendVerification(_req: Request, res: Response, _next: NextFunction) {
    return res.status(501).json({ message: 'Not implemented' });
  },
  async refreshToken(_req: Request, res: Response, _next: NextFunction) {
    return res.status(501).json({ message: 'Not implemented' });
  },
  async forgotPassword(_req: Request, res: Response, _next: NextFunction) {
    return res.status(501).json({ message: 'Not implemented' });
  },
  async resetPassword(_req: Request, res: Response, _next: NextFunction) {
    return res.status(501).json({ message: 'Not implemented' });
  },
  async logout(_req: Request, res: Response, _next: NextFunction) {
    return res.status(501).json({ message: 'Not implemented' });
  }
};