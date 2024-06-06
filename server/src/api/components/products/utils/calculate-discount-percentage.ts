import type { DiscountType, Discount } from '@prisma/client';

export function calculateDiscountPercentage(
  discountType: DiscountType,
  discountAmount: number,
  productPrice: number,
): number {
  if (discountType === 'fixed') {
    return (discountAmount / productPrice) * 100;
  } else {
    return discountAmount;
  }
}
