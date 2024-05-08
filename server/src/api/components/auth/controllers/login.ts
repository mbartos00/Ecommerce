import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { LoginSchema } from '@src/schemas/auth';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateTokens } from '@src/utils/tokens';
import type { ResponseFormat } from '@src/types/response';
import { REFRESH_TOKEN_COOKIE_NAME } from '../constants';
import type { User } from '@prisma/client';

type LoginUser = Omit<User, 'password'>;

type LoginResponse = Response<
  ResponseFormat & {
    accessToken: string;
    user: LoginUser;
  }
>;

export function login({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, LoginSchema>, res: LoginResponse) => {
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

    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      role: user.role,
    });

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = user;

    res
      .status(200)
      .json({ status: 'success', accessToken, user: userWithoutPassword });
  };
}
