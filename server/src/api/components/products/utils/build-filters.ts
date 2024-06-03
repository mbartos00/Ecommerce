import type { Prisma } from '@prisma/client';
import type { QueryParams } from '@src/api/components/products/types';

enum QueryParam {
  category = 'category',
  min_price = 'min_price',
  max_price = 'max_price',
  search = 'search',
  color = 'color',
  brand = 'brand',
  condition = 'condition',
  size = 'size',
}

export function buildProductsFilters(
  queryParams: QueryParams,
): Prisma.ProductWhereInput {
  return Object.keys(queryParams).reduce(
    (acc: Prisma.ProductWhereInput, key) => {
      switch (key) {
        case QueryParam.category:
          acc.categories = {
            every: {
              name: {
                contains: queryParams[key]?.toLowerCase(),
                mode: 'insensitive',
              },
            },
          };
          break;
        case QueryParam.min_price:
          if (typeof acc.price === 'object') {
            acc.price = {
              ...acc.price,
              gte: parseFloat(queryParams.min_price!),
            };
          }
          acc.price = {
            gte: parseFloat(queryParams.min_price!),
          };
          break;
        case QueryParam.max_price:
          if (typeof acc.price === 'object') {
            acc.price = {
              ...acc.price,
              lte: parseFloat(queryParams.max_price!),
            };
          }
          acc.price = {
            lte: parseFloat(queryParams.max_price!),
          };
          break;
        case QueryParam.search:
          acc.name = { contains: queryParams[key], mode: 'insensitive' };
          break;
        case QueryParam.color:
        case QueryParam.condition:
        case QueryParam.size:
          acc.variants = acc.variants || { some: {} };
          if (acc.variants.some) {
            acc.variants.some[key] = queryParams[key];
          }
          break;
        default:
          break;
      }
      return acc;
    },
    {},
  );
}
