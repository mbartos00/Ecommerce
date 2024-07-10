import type { NewsCategory } from '@prisma/client';
import type { Dependecies } from '@src/config/dependencies';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';

export function getNewsCategories({ prisma }: Dependecies) {
  return async (
    req: Request,
    res: Response<ResponseFormat<NewsCategory[]>>,
  ) => {
    const newsCategories = await prisma.newsCategory.findMany({
      distinct: ['name'],
    });

    res.json({
      status: 'success',
      data: newsCategories,
    });
  };
}
