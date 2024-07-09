import type { Dependecies } from '@src/config/dependencies';
import type { LoginSchema } from '@src/schemas/auth';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';
import { HttpError } from '@src/errors';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '@src/config/env';

export function verifyEmail({ prisma }: Dependecies) {
  return async (
    req: Request<{}, {}, {}, { token: string }>,
    res: Response<ResponseFormat<{ email: string }>>,
  ) => {
    const { id } = req.user!;

    const { token } = req.query;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    jwt.verify(token, env.JWT_SECRET, function (err, decoded) {
      if (err) {
        throw new HttpError('Verification failed or invalid token', 403);
      } else {
        const payload = decoded as JwtPayload;
        if (payload.data.email) {
          res.status(200).json({
            status: 'success',
            data: { email: payload.data.newEmail },
          });
        }
      }
    });
  };
}
