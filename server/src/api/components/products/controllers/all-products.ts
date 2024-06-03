import type { Product } from '@prisma/client';
import type { QueryParams } from '@src/api/components/products/types';
import type { Dependecies } from '@src/config/dependencies';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@src/constants';
import { HttpError } from '@src/errors';
import type { Pagination } from '@src/types/pagination';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';
import { buildProductsFilters } from '../utils/build-filters';
import { discountProductPrice } from '../utils/discount-product-price';

export function getAllProducts({ prisma }: Dependecies) {
  return async (
    req: Request<{}, {}, {}, QueryParams>,
    res: Response<ResponseFormat<Product[]> & { paginationInfo: Pagination }>,
  ) => {
    const page = parseInt(req.query.page ?? DEFAULT_PAGE);
    const perPage = parseInt(req.query.perPage ?? DEFAULT_PER_PAGE);
    const sortBy = req.query.sortBy || 'name';
    const order = req.query.order || 'asc';

    const whereClause = buildProductsFilters(req.query);

    const productCount = await prisma.product.count({ where: whereClause });

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
        discount: {
          where: {
            AND: [
              { endDate: { gte: new Date() } },
              { startDate: { lte: new Date() } },
            ],
          },
          select: {
            type: true,
            value: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    const processedProducts = discountProductPrice(products);

    res.json({
      status: 'success',
      paginationInfo: {
        count: productCount,
        page,
        perPage,
        totalPages: Math.ceil(Math.ceil(productCount / perPage)),
      },
      data: processedProducts,
    });
  };
}
