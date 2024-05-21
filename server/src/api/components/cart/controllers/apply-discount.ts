import { Request, Response } from 'express';
import type { ResponseFormat } from '@src/types/response';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';

export function applyDiscount({ prisma }: Dependecies) {
  return async (
    req: Request,
    res: Response<ResponseFormat & { code: string }>,
  ) => {
    const { code } = req.body;

    if (!code) {
      throw new HttpError('Request body is missing or invalid', 400);
    }

    try {
      const discount = await prisma.discount.findUnique({
        where: { code },
      });

      if (!discount) {
        throw new HttpError('The discount code is not valid', 404);
      }

      const currentDate = new Date();

      if (discount.expiresAt && discount.expiresAt < currentDate) {
        throw new HttpError('The discount code has expired', 400);
      }

      res.json({
        status: 'success',
        code: discount.code,
        discount_amount: discount.discountAmount,
        discount_type: discount.discountType,
        message: 'Discount applied successfully.',
      });
    } catch (error) {
      console.error(error);
      throw new HttpError(error, 500);
    }
  };
}
