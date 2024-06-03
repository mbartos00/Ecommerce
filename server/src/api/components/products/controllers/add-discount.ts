import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { ProductDiscountSchema } from '@src/schemas/products';
import type { Request, Response } from 'express';
import { hasProductExistingDiscount } from '../utils/has-product-existing-discount';

export function addProductDiscount({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, ProductDiscountSchema>, res: Response) => {
    const { productId, type, value, startDate, endDate } = req.body;

    await hasProductExistingDiscount({ prisma }, productId);

    try {
      const discount = await prisma.productDiscount.create({
        data: {
          productId,
          type,
          value,
          startDate,
          endDate,
        },
      });

      res.json({ status: 'success', data: discount });
    } catch (error) {
      throw new HttpError('Unexpected error occured', 500);
    }
  };
}
