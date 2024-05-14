import type { Dependecies } from '@src/config/dependencies';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@src/constants';
import { HttpError } from '@src/errors';
import type { Pagination } from '@src/types/pagination';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';
import type { QueryParams } from '../types';
import { buildNewsFilters } from '../utils/build-filters';
import type { News } from '@prisma/client';

export function getAllNews({ prisma }: Dependecies) {
  return async (
    req: Request<{}, {}, {}, QueryParams>,
    res: Response<ResponseFormat<News[]> & { paginationInfo: Pagination }>,
  ) => {
    const page = parseInt(req.query.page ?? DEFAULT_PAGE);
    const perPage = parseInt(req.query.perPage ?? DEFAULT_PER_PAGE);
    const sortBy = req.query.sortBy || 'title';
    const order = req.query.order || 'asc';

    const whereClause = buildNewsFilters(req.query);

    const newsCount = await prisma.news.count({ where: whereClause });

    const orderBy = [
      {
        [sortBy]: order,
      },
    ];

    if (newsCount === 0) {
      throw new HttpError('No news found', 404);
    }

    if (page > Math.ceil(newsCount / perPage)) {
      throw new HttpError('Page does not exists', 404);
    }

    const news = await prisma.news.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: whereClause,
      orderBy,
      include: {
        category: true,
      },
    });

    res.json({
      status: 'success',
      paginationInfo: {
        count: newsCount,
        page,
        perPage,
        totalPages: Math.ceil(Math.ceil(newsCount / perPage)),
      },
      data: news,
    });
  };
}
