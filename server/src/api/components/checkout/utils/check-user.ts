import type { PrismaClient } from '@prisma/client';
import { HttpError } from '@src/errors';

type Props = {
  prisma: InstanceType<typeof PrismaClient>;
  userId: string;
  addressId: string;
  paymentMethodId: string;
};

const checkUser = async ({
  prisma,
  userId,
  addressId,
  paymentMethodId,
}: Props) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      addresses: true,
      paymentMethods: true,
    },
  });

  if (!user?.addresses.some((address) => address.id === addressId)) {
    throw new HttpError('Invalid address', 400);
  }

  if (
    !user?.paymentMethods.some(
      (paymentMethod) => paymentMethod.id === paymentMethodId,
    )
  ) {
    throw new HttpError('Invalid payment method', 400);
  }
};
export default checkUser;
