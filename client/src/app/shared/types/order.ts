import { Address } from './address';
import { PaymentMethod } from './payment';
import { Product, Variant } from './product.model';
import { Shipping } from './shipping';
import { User } from './user';

export type Order = {
  name: string;
  id: string;
  userId: string;
  user: User;
  productIds: string[];
  products: Product[];
  orderProducts: OrderProducts[];
  shippingMethodId: string;
  shippingMethod: Shipping;
  addressId: string;
  address: Address;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
  orderPrice: number;
  createdAt: Date;
};

export type OrderProducts = {
  id: string;
  orderId: string;
  order: Order;
  productId: string;
  product: Product;
  variantId: string;
  variant: Variant;
  quantityToBuy: number;
};
