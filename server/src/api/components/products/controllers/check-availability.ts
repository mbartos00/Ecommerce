import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';

interface VariantToCheck {
  productId: string;
  variantId: string;
  quantityToBuy: number;
}

interface AvailabilityResult {
  productId: string;
  variantId: string;
  availableQuantity: number;
  quantityToBuy: number;
  isAvailable: boolean;
}

export function checkAvailability({ prisma }: Dependecies) {
  return async (
    req: Request,
    res: Response<ResponseFormat<AvailabilityResult[]>>,
  ) => {
    const variantsToCheck: VariantToCheck[] = req.body;

    try {
      const results = await prisma.$transaction(async (prisma) => {
        return await Promise.all(
          variantsToCheck.map(async (item) => {
            const product = await prisma.product.findUnique({
              where: { id: item.productId },
              include: {
                variants: {
                  where: { id: item.variantId },
                  select: { id: true, quantity: true },
                },
              },
            });

            if (product && product.variants.length > 0) {
              const variant = product.variants[0];
              return {
                productId: item.productId,
                variantId: item.variantId,
                availableQuantity: variant.quantity,
                quantityToBuy: item.quantityToBuy,
                isAvailable: variant.quantity >= item.quantityToBuy,
              };
            }

            return null;
          }),
        );
      });

      const filteredResults = results.filter(
        (result): result is AvailabilityResult => result !== null,
      );

      res.json({
        status: 'success',
        data: filteredResults,
      });
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2023'
      ) {
        throw new HttpError('Invalid product or variant id', 500);
      }

      throw error;
    }
  };
}
