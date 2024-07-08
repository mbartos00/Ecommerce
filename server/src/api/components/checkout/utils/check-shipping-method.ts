import type { PrismaClient, ShippingCost } from '@prisma/client';
import { HttpError } from '@src/errors';

const checkShippingMethod = async (
  prisma: InstanceType<typeof PrismaClient>,
  shippingMethodId: string,
): Promise<ShippingCost> => {
  const shippingMethod = await prisma.shippingCost.findFirst({
    where: {
      id: shippingMethodId,
    },
  });

  if (!shippingMethod) {
    throw new HttpError('Shipping method does not exist', 404);
  }

  return shippingMethod;
};

export default checkShippingMethod;
