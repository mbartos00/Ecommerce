import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { Request, Response } from 'express';

type RequestType = {
  id: string;
};

export function deleteOrder({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, RequestType>, res: Response) => {
    const { id } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: id },
      select: {
        products: true,
      },
    });

    if (!order) {
      throw new HttpError("Order doesn't exists", 404);
    }

    try {
      await prisma
        .$transaction(async (prisma) => {
          for (let product of order.products) {
            await prisma.product.update({
              where: {
                id: product.id,
              },
              data: {
                order: {
                  disconnect: [{ id: id }],
                },
              },
            });
          }
        })
        .then(async () => {
          await prisma.order.delete({
            where: {
              id: id,
            },
          });
        });

      res.json({ status: 'success' });
    } catch (error) {
      throw new HttpError('Unable to delete order', 500);
    }
  };
}
