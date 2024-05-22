import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { RegisterSchema } from '@src/schemas/auth';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { SALT_ROUNDS } from '../constants';

export function register({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, RegisterSchema>, res: Response) => {
    const { email, password, name, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await prisma.user
      .create({
        data: {
          email,
          name,
          lastName,
          password: hashedPassword,
        },
      })
      .catch((error: unknown) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new HttpError('Email is already used', 403);
          }
        }

        throw error;
      });

    res.sendStatus(201);
  };
}
