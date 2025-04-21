import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler';

interface TokenPayload {
  userId: number;
  type: 'access' | 'refresh';
}

export class TokenService {
  private static readonly ACCESS_TOKEN_EXPIRY = '15m';
  private static readonly REFRESH_TOKEN_EXPIRY = '7d';

  static generateTokens(userId: number): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      process.env.JWT_SECRET || '',
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || '',
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    );

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || '') as TokenPayload;
    } catch (error) {
      throw new AppError(401, 'Invalid access token', 'INVALID_ACCESS_TOKEN');
    }
  }

  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET || '') as TokenPayload;
    } catch (error) {
      throw new AppError(401, 'Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }
  }
} 