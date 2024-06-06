import { discountProductPrice } from '../utils/discount-product-price';
import { calculateDiscountPercentage } from '../utils/calculate-discount-percentage';
import type { ResponseFormat } from '@src/types/response';
import type { Product } from '@prisma/client';
import type { Request, Response } from 'express';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import { buildProductsFilters } from '../utils/build-filters';
import { SALE_PERCENTAGE } from '@src/constants';

export function getAllDiscountedProducts({ prisma }: Dependecies) {
  return async (req: Request, res: Response<ResponseFormat<Product[]>>) => {
    const whereClause = buildProductsFilters(req.query);

    try {
      const products = await prisma.product.findMany({
        where: {
          ...whereClause,
          discount: {
            isNot: null,
          },
        },
        include: {
          categories: true,
          variants: true,
          discount: true,
        },
      });

      const filteredProducts = products.filter((product) => {
        if (product.discount) {
          const discountPercentage = calculateDiscountPercentage(
            product.discount.type,
            product.discount.value,
            product.price,
          );
          return discountPercentage > SALE_PERCENTAGE;
        }
        return false;
      });

      const processedProducts = discountProductPrice(filteredProducts);

      res.json({
        status: 'success',
        data: processedProducts,
      });
    } catch (error) {
      console.error(error);
      throw new HttpError('An unexpected server error occurred', 500);
    }
  };
}
