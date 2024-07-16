import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { Request, Response } from 'express';

export function getOrdersByUser({ prisma }: Dependecies) {
  return async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpError('Unauthorized', 401);
      }

      const orders = await prisma.order.findMany({
        where: { userId: userId },
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
          orderProducts: {
            include: {
              product: true,
              variant: true,
            },
          },
          shippingMethod: true,
        },
      });

      res.json({ status: 'success', data: orders });
    } catch {
      throw new HttpError('Unable to retrieve orders', 500);
    }
  };
}
