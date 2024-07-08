import type { CartProductSchema } from '@src/schemas/checkout';

const createSoldProducts = (cartProducts: CartProductSchema[]) => {
  return cartProducts.map((product) => ({
    productId: product.id,
    quantity: product.quantityToBuy,
  }));
};

export default createSoldProducts;
