import { PaymentTypes, type PaymentMethod } from '@prisma/client';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { Request, Response } from 'express';

type RequestType = {
  id: string;
};

export function removePaymentMethod({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, RequestType>, res: Response) => {
    const { id } = req.body;

    try {
      await prisma.paymentMethod.delete({
        where: {
          id,
        },
      });

      res.json({ status: 'success' });
    } catch (error) {
      throw new HttpError('Unable to delete payment method', 500);
    }
  };
}