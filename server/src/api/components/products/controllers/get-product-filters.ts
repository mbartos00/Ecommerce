import type { Prisma, Size } from '@prisma/client';
import type { Dependecies } from '@src/config/dependencies';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';

type ResponseType = {
  color: {
    color: string;
  }[];
  size: {
    size: Size;
  }[];
  condition: {
    condition: 'new' | 'used';
  }[];
  price: Prisma.GetProductAggregateType<{
    _min: { price: true };
    _max: { price: true };
  }>;
  brand: {
    brand: string;
  }[];
};

export function getProductFilters({ prisma }: Dependecies) {
  return async (req: Request, res: Response<ResponseFormat<ResponseType>>) => {
    const [color, size, condition, price, brand] = await prisma.$transaction([
      prisma.variant.findMany({
        select: {
          color: true,
        },
        distinct: ['color'],
      }),
      prisma.variant.findMany({
        select: {
          size: true,
        },
        distinct: ['size'],
      }),
      prisma.variant.findMany({
        select: {
          condition: true,
        },
        distinct: ['condition'],
      }),
      prisma.product.aggregate({
        _min: {
          price: true,
        },
        _max: {
          price: true,
        },
      }),
      prisma.product.findMany({
        select: {
          brand: true,
        },
        distinct: ['brand'],
      }),
    ]);

    const filters = { color, size, condition, price, brand };

    res.json({
      status: 'success',
      data: filters,
    });
  };
}
