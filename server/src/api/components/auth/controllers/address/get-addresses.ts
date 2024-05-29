import type { Address } from '@prisma/client';
import type { Dependecies } from '@src/config/dependencies';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';
import { HttpError } from '@src/errors';

export function getAllAddresses({ prisma }: Dependecies) {
  return async (req: Request, res: Response<ResponseFormat<Address[]>>) => {
    const userId = req.user!.id;

    try {
      const addresses = await prisma.address.findMany({
        where: {
          userId: userId,
        },
      });
      res.json({
        status: 'success',
        data: addresses,
      });
    } catch (error) {
      console.error(error);
      throw new HttpError('An unexpected server error occurred', 500);
    }
  };
}
