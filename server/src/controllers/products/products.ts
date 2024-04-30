import type { Dependecies } from '@src/config/dependencies';
import { HttpError, errorMessages } from '@src/errors';
import type { Product, QueryParams } from '@src/types/products';
import type { ErrorResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';
import buildFilters from './utils/build-filters';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DEFAULT_PAGE, DEFAULT_PRODUCTS_PER_PAGE } from '@src/constants';

type GETProductsResponse = {
  page: number;
  perPage: number;
  results: Product[];
  count: number;
  totalPages: number;
};

export function getAllProducts({ prisma }: Dependecies) {
  return async (
    req: Request<Object, Object, Object, QueryParams>,
    res: Response<GETProductsResponse | ErrorResponseFormat>,
  ) => {
    try {
      const page = parseInt(req.query.page ?? DEFAULT_PAGE);
      const perPage = parseInt(req.query.perPage ?? DEFAULT_PRODUCTS_PER_PAGE);
      const sortBy = req.query.sortBy || 'name';
      const order = req.query.order || 'asc';

      const whereClause = buildFilters(req.query);

      const productCount = await prisma.product.count();

      const orderBy = [
        {
          [sortBy]: order,
        },
      ];

      if (productCount === 0) {
        return res
          .status(404)
          .json({ status: 'error', message: errorMessages.noProducts });
      }

      if (page > Math.ceil(productCount / perPage)) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Page does not exists' });
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
        page,
        perPage,
        results: products,
        count: productCount,
        totalPages: Math.ceil(Math.ceil(productCount / perPage)),
      });
    } catch (error: unknown) {
      throw new HttpError(errorMessages.unknownError, 500);
    }
  };
}

export function getProductById({ prisma }: Dependecies) {
  return async (req: Request, res: Response<Product | ErrorResponseFormat>) => {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: {
          id,
        },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
          variants: true,
        },
      });

      if (!product) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Product not found' });
      }

      res.json(product);
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2023') {
          throw new HttpError('Invalid product id', 500);
        }
      }

      throw new HttpError(errorMessages.unknownError, 500);
    }
  };
}
