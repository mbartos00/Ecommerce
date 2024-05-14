import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { LoginSchema } from '@src/schemas/auth';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '@src/utils/tokens';
import type { ResponseFormat } from '@src/types/response';

export function login({ prisma }: Dependecies) {
  return async (
    req: Request<{}, {}, LoginSchema>,
    res: Response<ResponseFormat & { token: string }>,
  ) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpError('Invalid email or password', 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password!);

    if (!passwordMatch) {
      throw new HttpError('Invalid email or password', 401);
    }

    const token = generateAccessToken(user.id, '15m');

    res.status(200).json({ status: 'success', token });
  };
}
