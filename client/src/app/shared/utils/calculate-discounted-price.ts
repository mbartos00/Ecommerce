import { Product } from '../types/product.model';

const calculateDiscountedPrice = (productDetails: Product): number => {
  if (productDetails.discount) {
    if (productDetails.discount.type === 'percentage') {
      return (
        productDetails.price -
        productDetails.price * (productDetails.discount.value / 100)
      );
    } else {
      return productDetails.price - productDetails.discount.value;
    }
  }

  return productDetails.price;
};

export default calculateDiscountedPrice;
