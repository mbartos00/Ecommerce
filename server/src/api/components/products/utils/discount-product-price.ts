import type { Prisma } from '@prisma/client';

type Product = Prisma.ProductGetPayload<{
  include: {
    discount: {
      select: {
        type: true;
        value: true;
        startDate: true;
        endDate: true;
      };
    };
    categories: {
      select: {
        id: true;
        name: true;
      };
    };
    variants: true;
  };
}>;

export function discountProductPrice(products: Product[]) {
  return products.map((product) => {
    let discountedPrice = 0;
    if (product.discount) {
      if (product.discount.type === 'fixed') {
        discountedPrice = product.price - product.discount.value;
      } else {
        discountedPrice =
          product.price - product.price * (product.discount.value / 100);
      }
    }

    return product.discount
      ? {
          ...product,
          discountedPrice: discountedPrice,
        }
      : product;
  });
}
