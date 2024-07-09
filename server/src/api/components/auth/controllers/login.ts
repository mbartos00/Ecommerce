import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { LoginSchema } from '@src/schemas/auth';
import type { ResponseFormat } from '@src/types/response';
import { generateAccessToken, generateRefreshToken } from '@src/utils/tokens';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import type { User } from '@prisma/client';
import { REFRESH_TOKEN_COOKIE_NAME } from '../constants';

export function login({ prisma }: Dependecies) {
  return async (
    req: Request<{}, {}, LoginSchema>,
    res: Response<
      ResponseFormat & { token: string; data: Omit<User, 'password'> }
    >,
  ) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpError('Invalid email', 400);
    }

    const passwordMatch = await bcrypt.compare(password, user.password!);

    if (!passwordMatch) {
      throw new HttpError('Invalid password', 400);
    }

    const tokenPayload = { id: user.id, email: user.email };
    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(tokenPayload);

    const { password: userPassword, ...responseUser } = user;

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ status: 'success', token, data: responseUser });
  };
}
