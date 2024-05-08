import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { RegisterSchema } from '@src/schemas/auth';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';

export function register({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, RegisterSchema>, res: Response) => {
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

        throw error;
      });

    res.sendStatus(201);
  };
}
