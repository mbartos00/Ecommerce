import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { RegisterSchema } from '@src/schemas/auth';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { SALT_ROUNDS } from '../constants';
import sanitizeFilename from './utils/sanitizeFilename';

export function register({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, RegisterSchema>, res: Response) => {
    const { email, password, name, lastName, gender, birthday, phone_number } =
      req.body;

    const avatarPath = req.file
      ? `${process.env.DOMAIN}:${process.env.PORT}/${sanitizeFilename(req.file.path.split('uploads/')[1])}`
      : `${process.env.DOMAIN}:${process.env.PORT}/defaultAvatar.png`;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await prisma.user
      .create({
        data: {
          email,
          name,
          lastName,
          password: hashedPassword,
          gender,
          birthday: new Date(birthday).toISOString(),
          phone_number,
          profile_photo_url: avatarPath,
        },
      })
      .catch((error: unknown) => {
        console.error(error);
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
