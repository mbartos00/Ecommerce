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
    profile: true;
    paymentMethods: true;
    createdAt: true;
  };
}>;

export function getUserData({ prisma }: Dependecies) {
  return async (req: Request, res: Response<ResponseFormat<UserResponse>>) => {
    const { id } = req.user!;

    const foundUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        favorites_list: true,
        profile: true,
        paymentMethods: true,
        createdAt: true,
        addresses: true,
      },
    });

    if (!foundUser) {
      throw new HttpError('User not found', 404);
    }

    res.json({
      status: 'success',
      data: foundUser,
    });
  };
}
