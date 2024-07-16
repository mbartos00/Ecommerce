import { Product } from './product.model';

export type User = {
  id: string;
  email: string;
  name: string;
  lastName: string;
  gender: Gender;
  birthday: Date;
  phone_number: string;
  profile_photo_url: string;
  favorites_list: Favorites;
  paymentMethods: PaymentMethod[];
  addresses: Address[];
  role: 'user' | 'admin';
  createdAt: Date;
};

export type Address = {
  id: string;
  country: string;
  name: string;
  lastName: string;
  street_address: string;
  street_address_2: string;
  city: string;
  state_province_region: string;
  zip_code: string;
  phone_number: string;
  userId: string;
  user: User;
};

export type Favorites = {
  id: string;
  user: User;
  userId: string;
  products: Product[];
};

export type PaymentMethod = {
  id: string;
  type: PaymentTypes;
  cardNumber?: string;
  expirationDate?: string;
  securityCode?: string;
  cardHolder?: string;

  email?: string;
  phoneNumber?: string;

  firstName?: string;
  lastName?: string;
  accountNumber?: string;
  bankName?: string;
  address?: string;

  userId?: string;
  user?: User;
};

export type Gender = 'male' | 'female' | 'other';

export enum PaymentTypes {
  credit_card = 'credit_card ',
  paypal = 'paypal ',
  bank_transfer = 'bank_transfer ',
}
