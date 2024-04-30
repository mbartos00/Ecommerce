import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { HttpError } from '@src/errors';
import type { RegisterSchema } from '@src/schemas/auth';
import type { SuccessResponseFormat } from '@src/types/response';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import type { Dependecies } from '../../config/dependencies';

export function register({ prisma }: Dependecies) {
  return async (
    req: Request<{}, {}, RegisterSchema>,
    res: Response<SuccessResponseFormat>,
  ) => {
    const { email, password, name } = req.body;
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await prisma.user
      .create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      })
      .catch((error: unknown) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new HttpError('Email is already used', 403);
          }
        }

        throw new HttpError('Something went wrong', 500);
      });

    res.status(201).json({
      status: 'success',
      message: 'User created',
    });
  };
}
