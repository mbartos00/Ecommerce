import { z } from 'zod';

const priceValidation = z
  .number()
  .positive()
  .superRefine((price, ctx) => {
    const splitted = price.toString().split('.');
    if (splitted.length > 1 && splitted[1].length <= 2)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Max precision is 2 decimal places',
        path: ['price'],
      });
  });

enum Condition {
  new = 'new',
  used = 'used',
}
enum Size {
  xs = 'xs',
  s = 's',
  m = 'm',
  l = 'l',
  xl = 'xl',
  xxl = 'xxl',
}

export const cartProductSchema = z
  .object({
    id: z.string().length(24),
    name: z.string(),
    brand: z.string(),
    price: priceValidation,
    images: z.array(z.string().url()).max(3),
    variantId: z.string().length(24),
    color: z.string(),
    condition: z.nativeEnum(Condition),
    size: z.nativeEnum(Size),
    availableQuantity: z.number().refine((val) => val > 0, {
      message: 'Available quantity must be greater than 0',
    }),
    quantityToBuy: z.number().min(1, {
      message: 'Quantity to buy must be at least 1',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.quantityToBuy > data.availableQuantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Quantity to buy must be less than or equal to available quantity',
        path: ['quantityToBuy'],
      });
    }
  });

export const checkoutSchema = z.object({
  products: z.array(cartProductSchema).superRefine((data, ctx) => {
    if (data.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Product list is required',
        path: ['products'],
      });
    }
  }),
  addressId: z.string().length(24),
  paymentMethodId: z.string().length(24),
  shippingMethodId: z.string().length(24),
  discountId: z.string().length(24).optional(),
});

export type CartProductSchema = z.infer<typeof cartProductSchema>;
export type CheckoutSchema = z.infer<typeof checkoutSchema>;
