import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';
import type { ShippingCost } from '@prisma/client';

export function getShipping({ prisma }: Dependecies) {
  return async (
    req: Request,
    res: Response<ResponseFormat<ShippingCost[]>>,
  ) => {
    try {
      const shipping = await prisma.shippingCost.findMany();

      res.json({
        status: 'success',
        data: shipping,
      });
    } catch (error) {
      console.error(error);
      throw new HttpError('An unexpected server error occurred', 500);
    }
  };
}
