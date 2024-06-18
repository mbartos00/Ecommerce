import type { Prisma } from '@prisma/client';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';

type UserResponse = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
    lastName: true;
    favorites_list: true;
    gender: true;
    birthday: true;
    phone_number: true;
    profile_photo_url: true;
    paymentMethods: true;
    createdAt: true;
  };
}>;

export function getUserData({ prisma }: Dependecies) {
  return async (req: Request, res: Response<ResponseFormat<UserResponse>>) => {
    const { id } = req.user!;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        favorites_list: true,
        paymentMethods: true,
      },
    });

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    const { password, role, ...foundUser } = user;

    res.json({
      status: 'success',
      data: foundUser,
    });
  };
}
