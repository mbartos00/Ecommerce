import { PaymentTypes, type PaymentMethod } from '@prisma/client';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { Request, Response } from 'express';
import paymentMethodCreator from '../utils/payment-method-creator';

type RequestType = {
  type: PaymentTypes;
} & PaymentMethod;

export function addPaymentMethod({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, RequestType>, res: Response) => {
    const { type, ...details } = req.body;

    try {
      const paymentMethod = await paymentMethodCreator(
        type,
        details,
        prisma,
        req.user!.id,
      );
      res.json({ status: 'success', data: paymentMethod });
    } catch (error: any) {
      throw new HttpError(
        error.message || 'Failed to create payment method',
        500,
      );
    }
  };
}
