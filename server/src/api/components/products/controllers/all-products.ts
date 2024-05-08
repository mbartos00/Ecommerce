import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { QueryParams } from '@src/api/components/products/types';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';
import type { Product } from '@prisma/client';
import { buildProductsFilters } from '../utils/build-filters';

type Info = {
  page: number;
  perPage: number;
  count: number;
  totalPages: number;
};

const DEFAULT_PAGE = '1';
const DEFAULT_PRODUCTS_PER_PAGE = '20';

export function getAllProducts({ prisma }: Dependecies) {
  return async (
    req: Request<{}, {}, {}, QueryParams>,
    res: Response<ResponseFormat<Product[]> & { info: Info }>,
  ) => {
    const page = parseInt(req.query.page ?? DEFAULT_PAGE);
    const perPage = parseInt(req.query.perPage ?? DEFAULT_PRODUCTS_PER_PAGE);
    const sortBy = req.query.sortBy || 'name';
    const order = req.query.order || 'asc';

    const whereClause = buildProductsFilters(req.query);

    const productCount = await prisma.product.count();

    const orderBy = [
      {
        [sortBy]: order,
      },
    ];

    if (productCount === 0) {
      throw new HttpError('No products found', 404);
    }

    if (page > Math.ceil(productCount / perPage)) {
      throw new HttpError('Page does not exists', 404);
    }

    const products = await prisma.product.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: whereClause,
      orderBy,
      include: {
        categories: {
          where: whereClause.categories?.every,
          select: {
            id: true,
            name: true,
          },
        },
        variants: {
          where: whereClause.variants?.some,
        },
      },
    });

    res.json({
      status: 'success',
      info: {
        count: productCount,
        page,
        perPage,
        totalPages: Math.ceil(Math.ceil(productCount / perPage)),
      },
      data: products,
    });
  };
}
