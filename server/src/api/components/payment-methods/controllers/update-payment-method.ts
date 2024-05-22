import { type PaymentMethod } from '@prisma/client';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { Request, Response } from 'express';
import removeNullishProperties from '../utils/remove-nullish-props';
import bcrypt from 'bcrypt';

type RequestType = {
  id: string;
} & PaymentMethod;

const SALT_ROUNDS = 10;

export function updatePaymentMethod({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, RequestType>, res: Response) => {
    const { id, type, ...details } = req.body;

    const originPaymentMethodType = await prisma.paymentMethod.findUnique({
      where: {
        id,
      },
      select: {
        type: true,
      },
    });

    if (originPaymentMethodType?.type !== type) {
      throw new HttpError(
        'Provided type differs from the original payment method',
        404,
      );
    }

    try {
      const hashedSecurityCode = details.securityCode
        ? await bcrypt.hash(details.securityCode, SALT_ROUNDS)
        : details.securityCode;

      const updated = await prisma.paymentMethod.update({
        where: {
          id,
        },
        data: {
          ...details,
          securityCode: hashedSecurityCode,
        },
      });

      res.json({ status: 'success', data: removeNullishProperties(updated) });
    } catch (error) {
      throw new HttpError('Unable to update payment method', 500);
    }
  };
}
