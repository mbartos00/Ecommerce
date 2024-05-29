import type { ResponseFormat, ResponseUser } from '@src/types/response';
import type { Request, Response } from 'express';

export async function getLoggedUser(
  req: Request,
  res: Response<ResponseFormat & { user: ResponseUser }>,
) {
  const { password, ...responseUser } = req.user!;

  res.status(200).json({
    status: 'success',
    user: responseUser,
  });
}
