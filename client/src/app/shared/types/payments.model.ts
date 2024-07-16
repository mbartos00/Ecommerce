export type PaymentTypeResponse = {
  status: string;
  data: PaymentType[];
};

export enum PaymentTypesEnum {
  credit_card = 'credit_card',
  paypal = 'paypal',
  bank_transfer = 'bank_transfer',
}

export type PaymentType = {
  id: string;
  type: PaymentTypesEnum;
  cardNumber: string | null;
  expirationDate: string | null;
  securityCode: string | null;
  cardHolder: string | null;
  email: string | null;
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  accountNumber: string | null;
  bankName: string | null;
  address: string | null;
  userId: string | null;
};
