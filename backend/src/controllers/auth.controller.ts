import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
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
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          verified: false,
          // Add Salesforce fields if needed, or leave null
        },
      });
      return res.status(201).json({ message: 'User registered successfully.' });
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

  async verifyEmail(_req: Request, res: Response, _next: NextFunction) {
    return res.status(501).json({ message: 'Not implemented' });
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