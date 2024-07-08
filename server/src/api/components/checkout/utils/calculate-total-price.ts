import type { CartProductSchema } from '@src/schemas/checkout';

type Props = {
  products: CartProductSchema[];
  discount: {
    discountAmount: number;
    discountType: 'fixed' | 'percentage';
  } | null;
  shippingPrice: number;
};

const calculateTotalPrice = ({ products, discount, shippingPrice }: Props) => {
  const totalPrice = products.reduce((total, product) => {
    return total + product.price * product.quantityToBuy;
  }, 0);

  if (discount && discount.discountType === 'percentage') {
    return (
      totalPrice - (totalPrice / 100) * discount.discountAmount + shippingPrice
    );
  }

  if (discount && discount.discountType === 'fixed') {
    return totalPrice - discount.discountAmount + shippingPrice;
  }

  return totalPrice + shippingPrice;
};

export default calculateTotalPrice;
