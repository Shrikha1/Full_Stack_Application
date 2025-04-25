import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export function signAccessToken(payload: object, expiresIn: string | number = '15m') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);
}

export function signRefreshToken(payload: object, expiresIn: string | number = '7d') {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn } as SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}
