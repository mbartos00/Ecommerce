import type { Dependecies } from '@src/config/dependencies';
import { env } from '@src/config/env';
import { HttpError } from '@src/errors';
import { isAuthPayload } from '@src/utils/tokens';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function auth({ prisma }: Dependecies) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new HttpError('Authentication failed', 401);
    }

    try {
      const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

      if (!isAuthPayload(payload)) {
        throw new Error();
      }

      const user = await prisma.user.findFirst({
        where: {
          id: payload.id,
        },
      });

      req.user = user ?? undefined;
      next();
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError(
        'Authentication failed',
        403,
        'Invalid or expired token',
      );
    }
  };
}
