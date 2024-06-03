import { bootstrapDependecies } from '@src/config/dependencies';

export async function checkAndRevokeExpiredDiscounts() {
  const { prisma } = await bootstrapDependecies();

  const currentDate = new Date();

  const expiredDiscounts = await prisma.productDiscount.findMany({
    where: {
      endDate: {
        lt: currentDate,
      },
    },
  });

  const updatedDiscounts = await Promise.all(
    expiredDiscounts.map(async (discount) => {
      return await prisma.productDiscount.delete({
        where: { id: discount.id },
      });
    }),
  );

  console.log(
    `${updatedDiscounts.length} expired discounts have been revoked.`,
  );
}
