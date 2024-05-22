import { PaymentTypes, PrismaClient, type PaymentMethod } from '@prisma/client';
import { HttpError } from '@src/errors';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const paymentMethodCreator = async (
  type: PaymentTypes,
  details: Partial<PaymentMethod>,
  prisma: InstanceType<typeof PrismaClient>,
  userId: string,
) => {
  switch (type) {
    case 'paypal':
      return await prisma.paymentMethod.create({
        data: {
          type: PaymentTypes.paypal,
          email: details?.email,
          phoneNumber: details?.phoneNumber,
          userId,
        },
      });
    case 'credit_card':
      return await prisma.paymentMethod.create({
        data: {
          type: PaymentTypes.credit_card,
          cardHolder: details.cardHolder,
          cardNumber: details.cardNumber,
          expirationDate: details.expirationDate,
          securityCode: await bcrypt.hash(details.securityCode!, SALT_ROUNDS),
          userId,
        },
      });
    case 'bank_transfer':
      return await prisma.paymentMethod.create({
        data: {
          type: PaymentTypes.bank_transfer,
          address: details.address,
          bankName: details.bankName,
          firstName: details.firstName,
          lastName: details.lastName,
          accountNumber: details.accountNumber,
          userId,
        },
      });
    default:
      throw new HttpError('Payment type not implemented', 500);
  }
};

export default paymentMethodCreator;
