import type { Address } from '@prisma/client';
import type { Dependecies } from '@src/config/dependencies';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';
import { HttpError } from '@src/errors';

export function getAddress({ prisma }: Dependecies) {
  return async (req: Request, res: Response<ResponseFormat<Address>>) => {
    const { id } = req.params;

    try {
      const address = await prisma.address.findUnique({
        where: {
          id,
        },
      });

      if (!address) {
        throw new HttpError('Address not found', 404);
      }

      res.json({
        status: 'success',
        data: address,
      });
    } catch (error) {
      console.error(error);
      throw new HttpError('An unexpected server error occurred', 500);
    }
  };
}
