import type { QueryParams } from '@src/types/products';

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

function buildFilters(query: QueryParams): Record<string, any> {
  return Object.keys(query).reduce((acc: Record<string, any>, key) => {
    switch (key) {
      case QueryParam.category:
        acc.categories = {
          every: {
            name: { contains: query[key]?.toLowerCase(), mode: 'insensitive' },
          },
        };
        break;
      case QueryParam.min_price:
        acc.price = { ...acc.price, gte: parseFloat(query[key]!) };
        break;
      case QueryParam.max_price:
        acc.price = { ...acc.price, lte: parseFloat(query[key]!) };
        break;
      case QueryParam.search:
        acc.name = { contains: query[key], mode: 'insensitive' };
        break;
      case QueryParam.brand:
      case QueryParam.color:
      case QueryParam.condition:
      case QueryParam.size:
        acc.variants = acc.variants || { some: {} };
        acc.variants.some[key] = query[key];
        break;
      default:
        break;
    }
    return acc;
  }, {});
}
export default buildFilters;
