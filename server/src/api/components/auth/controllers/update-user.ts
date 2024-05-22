import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { UpdateUserSchema } from '@src/schemas/auth';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { SALT_ROUNDS } from '../constants';

export function updateUser({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, UpdateUserSchema>, res: Response) => {
    const { id } = req.user!;
    const { oldPassword, profile, newPassword, repeatPassword, ...userData } =
      req.body;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    const passwordMatch = !!oldPassword
      ? await bcrypt.compare(oldPassword, user?.password!)
      : undefined;

    if (passwordMatch === false) {
      throw new HttpError('Invalid password', 401);
    }

    if (!user?.profile) {
      throw new HttpError('User has no existing profile', 404);
    }

    try {
      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          password: newPassword
            ? await bcrypt.hash(newPassword, SALT_ROUNDS)
            : undefined,
          ...userData,
          profile: {
            update: profile,
          },
        },
        include: {
          profile: true,
        },
      });

      const { password, ...userWithoutPassword } = updatedUser;

      res.json({ status: 'success', userWithoutPassword });
    } catch (error) {
      throw new HttpError('Unable to update user', 500);
    }
  };
}
