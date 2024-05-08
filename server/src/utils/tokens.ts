import jwt from 'jsonwebtoken';
import { env } from '@src/config/env';
import type { User } from '@prisma/client';

type AuthPayload = Pick<User, 'id' | 'role'>;

const ACCESS_TOKEN_EXPIRATION_TIME = '15m';
const REFRESH_TOKEN_EXPIRATION_TIME = '1d';

export function isAuthPayload(obj: any): obj is AuthPayload {
  return typeof obj.id === 'string' && typeof obj.role === 'string';
}

export const generateTokens = (payload: AuthPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export function generateAccessToken(payload: AuthPayload) {
  const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });

  return accessToken;
}

export function generateRefreshToken(payload: AuthPayload) {
  const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });

  return refreshToken;
}
