import { User } from './user';

export type PaymentMethod = {
  id: string;
  type: PaymentTypeKey;
  cardNumber: string;
  expirationDate: string;
  securityCode: string;
  cardHolder: string;

  email: string;
  phoneNumber: string;

  firstName: string;
  lastName: string;
  accountNumber: string;
  bankName: string;
  address: string;

  userId: string;
  user: User;
};

export const PaymentTypes = {
  credit_card: 'Credit Card',
  paypal: 'Paypal',
  bank_transfer: 'Bank Transfer',
};

export type PaymentTypeKey = keyof typeof PaymentTypes;
// export type PaymentTypeValue = (typeof PaymentTypes)[PaymentTypeKey];
