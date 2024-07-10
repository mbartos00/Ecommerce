import { z } from 'zod';

enum DiscountType {
  percentage = 'percentage',
  fixed = 'fixed',
}

export const addDiscountSchema = z.object({
  productId: z.string().length(24),
  type: z.nativeEnum(DiscountType),
  value: z.number().min(5).max(99),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export type ProductDiscountSchema = z.infer<typeof addDiscountSchema>;

export const variantToCheckSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantityToBuy: z.number().int().positive(),
});

export type VariantToCheck = z.infer<typeof variantToCheckSchema>;
