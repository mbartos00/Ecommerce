import type { PaymentTypes } from '@prisma/client';
import { PAYMENT_TYPES } from '@src/constants';
import { HttpError } from '@src/errors';
import {
  bankTransferSchema,
  bankUpdateSchema,
  cardPaymentSchema,
  cardUpdateSchema,
  paypalPaymentSchema,
  paypalUpdateSchema,
} from '@src/schemas/paymentMethods';

const getPaymentTypeSchema = (type: PaymentTypes, requestMethod: string) => {
  if (requestMethod === 'PATCH') {
    switch (type) {
      case PAYMENT_TYPES.credit_card:
        return cardUpdateSchema;
      case PAYMENT_TYPES.paypal:
        return paypalUpdateSchema;
      case PAYMENT_TYPES.bank_transfer:
        return bankUpdateSchema;
      default:
        throw new HttpError('Unsuported payment type or no type provided', 400);
    }
  } else {
    switch (type) {
      case PAYMENT_TYPES.credit_card:
        return cardPaymentSchema;
      case PAYMENT_TYPES.paypal:
        return paypalPaymentSchema;
      case PAYMENT_TYPES.bank_transfer:
        return bankTransferSchema;
      default:
        throw new HttpError('Unsuported payment type or no type provided', 400);
    }
  }
};

export default getPaymentTypeSchema;
