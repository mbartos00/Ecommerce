import type { User } from '@prisma/client';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';

export async function getLoggedUser(
  req: Request,
  res: Response<ResponseFormat & { user: User }>,
) {
  res.status(200).json({
    status: 'success',
    user: req.user!,
  });
}
