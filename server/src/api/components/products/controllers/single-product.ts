import type { Product } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';

export function getProductById({ prisma }: Dependecies) {
  return async (req: Request, res: Response<ResponseFormat<Product>>) => {
    const { id } = req.params;

    const product = await prisma.product
      .findUnique({
        where: {
          id,
        },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
          variants: true,
        },
      })
      .catch((error: unknown) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2023') {
            throw new HttpError('Invalid product id', 500);
          }
        }

        throw error;
      });

    if (!product) {
      throw new HttpError('Product not found', 404);
    }

    res.json({
      status: 'success',
      data: product,
    });
  };
}
