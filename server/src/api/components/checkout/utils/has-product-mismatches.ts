import type { Prisma } from '@prisma/client';
import { HttpError } from '@src/errors';
import type { CartProductSchema } from '@src/schemas/checkout';

type DbProducts = Prisma.ProductGetPayload<{
  include: {
    variants: true;
    categories: true;
    discount: true;
  };
}>;

const hasProductMismatches = (
  cartProducts: CartProductSchema[],
  dbProducts: DbProducts[],
) => {
  cartProducts.filter((product) => {
    const dbProduct = dbProducts.find((dbP) => dbP.id === product.id);

    if (!dbProduct) {
      throw new HttpError('Invalid product or variant', 400);
    }
  });
};

export default hasProductMismatches;
