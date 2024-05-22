import type { PaymentMethod } from '@prisma/client';
import type { Dependecies } from '@src/config/dependencies';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';

export function getAllUserMethods({ prisma }: Dependecies) {
  return async (
    req: Request,
    res: Response<ResponseFormat<PaymentMethod[]>>,
  ) => {
    const { user } = req;

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: {
        userId: user!.id,
      },
    });

    res.json({
      status: 'success',
      data: paymentMethods,
    });
  };
}
