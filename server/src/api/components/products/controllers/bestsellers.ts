import type { Dependecies } from '@src/config/dependencies';
import { DEFAULT_PAGE } from '@src/constants';
import { HttpError } from '@src/errors';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';

type QueryParams = {
  page: string;
  category: string | undefined;
  limit?: string;
};

const DEFAULT_BESTSELLERS_COUNT = 8;

export function getBestsellers({ prisma }: Dependecies) {
  return async (
    req: Request<{}, {}, {}, QueryParams>,
    res: Response<ResponseFormat<any>>,
  ) => {
    const page = parseInt(req.query.page ?? DEFAULT_PAGE);
    const categoryId = req.query.category;
    const limit = parseInt(req.query.limit!);

    const pipeline = [
      {
        $group: {
          _id: '$productId',
          totalSales: { $sum: '$quantity' },
        },
      },
      {
        $sort: { totalSales: -1 },
      },
      {
        $skip: (page - 1) * DEFAULT_BESTSELLERS_COUNT,
      },
      {
        $limit: limit || DEFAULT_BESTSELLERS_COUNT,
      },
      {
        $lookup: {
          from: 'Product',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $match: categoryId
          ? { 'productDetails.categoryIds': { $oid: categoryId } }
          : {},
      },
      {
        $unwind: '$productDetails',
      },
      {
        $addFields: {
          'productDetails.id': {
            $toString: '$productDetails._id',
          },
        },
      },
      {
        $lookup: {
          from: 'ProductDiscount',
          localField: '_id',
          foreignField: 'productId',
          as: 'discountDetails',
        },
      },
      {
        $addFields: {
          discount: { $arrayElemAt: ['$discountDetails', 0] },
        },
      },
      {
        $unwind: {
          path: '$discountDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          productDetails: {
            _id: 1,
            name: 1,
            categoryIds: 1,
            images: 1,
            rating: 1,
            price: 1,
            id: 1,
            discount: {
              type: '$discount.type',
              value: '$discount.value',
              startDate: '$discount.startDate',
              endDate: '$discount.endDate',
            },
          },
        },
      },
    ];

    try {
      const bestsellers = await prisma.soldProduct
        .aggregateRaw({ pipeline })
        .catch((e) => {
          console.log(e);
        });

      res.json({
        status: 'success',
        data: bestsellers,
      });
    } catch (e) {
      throw new HttpError('An unexpected server error occurred', 500);
    }
  };
}
