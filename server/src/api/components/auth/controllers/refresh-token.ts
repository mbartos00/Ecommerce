import type { Dependecies } from '@src/config/dependencies';
import { env } from '@src/config/env';
import { HttpError } from '@src/errors';
import type { ResponseFormat } from '@src/types/response';
import { generateAccessToken } from '@src/utils/tokens';
import type { Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { REFRESH_TOKEN_COOKIE_NAME } from '../constants';
import type { User } from '@prisma/client';

export function refreshToken({ prisma }: Dependecies) {
  return async (
    req: Request,
    res: Response<
      ResponseFormat & { accessToken: string; user: Omit<User, 'password'> }
    >,
  ) => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken) {
      throw new HttpError('Refresh Token missing', 403);
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        env.REFRESH_TOKEN_SECRET,
      ) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new HttpError('User not found', 403);
      }

      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
      });

      const { password, ...reponseUser } = user;

      res.status(200).json({
        status: 'success',
        accessToken,
        user: reponseUser,
      });
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new HttpError('Refresh Token expired', 403);
      } else {
        throw new HttpError('Verification failed', 403);
      }
    }
  };
}
