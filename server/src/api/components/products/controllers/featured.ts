import type { Dependecies } from '@src/config/dependencies';
import type { Response, Request } from 'express';
import { HttpError } from '@src/errors';

export function getFeatured({ prisma }: Dependecies) {
  return async (req: Request, res: Response) => {
    try {
      const featuredProducts = await prisma.product.findMany({
        where: {
          discount: {
            isNot: null,
          },
        },
        include: {
          discount: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 3,
      });

      if (featuredProducts.length === 0) {
        throw new HttpError('No featured found', 404);
      }

      res.json({
        status: 'success',
        data: featuredProducts,
      });
    } catch (error) {
      console.error(error);
      throw new HttpError('An unexpected server error occurred', 500);
    }
  };
}
