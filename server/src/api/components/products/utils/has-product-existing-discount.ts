import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';

export async function hasProductExistingDiscount(
  { prisma }: Dependecies,
  productId: string,
) {
  const currentDate = new Date();

  const existingDiscount = await prisma.productDiscount.findFirst({
    where: {
      productId,
    },
  });

  if (existingDiscount && existingDiscount?.endDate > currentDate) {
    throw new HttpError(
      'A product can only have one active discount at a time.',
      400,
    );
  }

  if (existingDiscount && existingDiscount.endDate < currentDate) {
    await prisma.productDiscount.delete({
      where: {
        productId,
      },
    });
  }
}
