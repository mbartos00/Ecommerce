import type { Prisma } from '@prisma/client';
import type { QueryParams } from '../types';

enum QueryParam {
  category = 'category',
  search = 'search',
}

export function buildNewsFilters(
  queryParams: QueryParams,
): Prisma.NewsWhereInput {
  return Object.keys(queryParams).reduce((acc: Prisma.NewsWhereInput, key) => {
    switch (key) {
      case QueryParam.category:
        acc.category = {
          name: {
            contains: queryParams[key]?.toLowerCase(),
            mode: 'insensitive',
          },
        };
        break;
      case QueryParam.search:
        acc.title = { contains: queryParams[key], mode: 'insensitive' };
        break;
      default:
        break;
    }
    return acc;
  }, {});
}
