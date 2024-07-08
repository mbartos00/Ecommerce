import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { Request, Response } from 'express';

export function getOrders({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, {}>, res: Response) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              birthday: true,
              gender: true,
              name: true,
              lastName: true,
              phone_number: true,
              profile_photo_url: true,
            },
          },
          address: true,
          paymentMethod: true,
          products: true,
          shippingMethod: true,
        },
      });

      res.json({ status: 'success', data: orders });
    } catch (error) {
      throw new HttpError('Unable to delete order', 500);
    }
  };
}
