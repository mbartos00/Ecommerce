import type { Dependecies } from '@src/config/dependencies';
import { env } from '@src/config/env';
import { HttpError } from '@src/errors';
import type { ResponseFormat } from '@src/types/response';
import { generateAccessToken } from '@src/utils/tokens';
import type { Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { REFRESH_TOKEN_COOKIE_NAME } from '../constants';

export function refreshToken({ prisma }: Dependecies) {
  return async (
    req: Request,
    res: Response<ResponseFormat & { accessToken: string }>,
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

      const payload = {
        id: decoded.id,
        role: decoded.role,
      };

      const accessToken = generateAccessToken(payload);

      res.status(200).json({
        status: 'success',
        accessToken,
      });
    } catch (err: unknown) {
      throw new HttpError('Verification failed', 403);
    }
  };
}
