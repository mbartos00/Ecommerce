import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { Request, Response } from 'express';

export function getOrderById({ prisma }: Dependecies) {
  return async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      if (!orderId) {
        throw new HttpError('No order id provided', 400);
      }

      if (!userId) {
        throw new HttpError('Unauthorized', 401);
      }

      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId: userId,
        },
        include: {
          address: true,
          paymentMethod: true,
          shippingMethod: true,
          products: true,
          orderProducts: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      if (!order) {
        throw new HttpError('Order not found', 404);
      }

      res.json({ status: 'success', data: order });
    } catch {
      throw new HttpError('Unable to retrieve order', 500);
    }
  };
}
