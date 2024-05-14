import type { News } from '@prisma/client';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';
import type { QueryParams } from '../types';

const DEFAULT_NEWS_LIMIT = 3;

export function getLatestNews({ prisma }: Dependecies) {
  return async (
    req: Request<{}, {}, {}, QueryParams>,
    res: Response<ResponseFormat<any[]>>,
  ) => {
    const limit = req.query?.limit || DEFAULT_NEWS_LIMIT;

    const latestNews = await prisma.news.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });

    if (!latestNews) {
      throw new HttpError('News not found', 404);
    }

    res.json({
      status: 'success',
      data: latestNews,
    });
  };
}
