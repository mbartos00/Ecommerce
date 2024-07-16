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
  const userMethods = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      paymentMethods: {
        where: {
          type,
        },
        select: {
          type: true,
          email: true,
          phoneNumber: true,
          cardNumber: true,
          accountNumber: true,
        },
      },
    },
  });

  const checkIfMethodExist = (
    field: keyof Partial<PaymentMethod>,
    value: string,
  ) => {
    const methodExists = userMethods?.paymentMethods.some(
      (method) => method[field as keyof typeof method] === value,
    );
    if (methodExists) {
      throw new HttpError('Payment method already exists', 400);
    }
  };

  switch (type) {
    case 'paypal':
      if (details.email) {
        checkIfMethodExist('email', details.email);
      } else if (details.phoneNumber) {
        checkIfMethodExist('phoneNumber', details.phoneNumber);
      }
      return await prisma.paymentMethod.create({
        data: {
          type: PaymentTypes.paypal,
          email: details?.email,
          phoneNumber: details?.phoneNumber,
          userId,
        },
      });
    case 'credit_card':
      checkIfMethodExist('cardNumber', details.cardNumber!);
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
      checkIfMethodExist('accountNumber', details.accountNumber!);
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
