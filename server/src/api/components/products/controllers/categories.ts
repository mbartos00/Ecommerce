import type { Dependecies } from '@src/config/dependencies';
import type { ResponseFormat } from '@src/types/response';
import type { Response, Request } from 'express';
import type { Category } from '@prisma/client';
import { HttpError } from '@src/errors';

type ProductsCategory = Omit<Category, 'productIds'>;

export function getAllCategories({ prisma }: Dependecies) {
  return async (
    req: Request,
    res: Response<ResponseFormat<ProductsCategory[]>>,
  ) => {
    try {
      const categories = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      if (categories.length === 0) {
        throw new HttpError('No categories found', 404);
      }

      res.json({
        status: 'success',
        data: categories,
      });
    } catch (error) {
      console.error(error);
      throw new HttpError('An unexpected server error occurred', 500);
    }
  };
}
