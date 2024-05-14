import type { News } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { ResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';

export function getNewsById({ prisma }: Dependecies) {
  return async (req: Request, res: Response<ResponseFormat<News>>) => {
    const { id } = req.params;

    const news = await prisma.news
      .findUnique({
        where: {
          id,
        },
        include: {
          category: true,
        },
      })
      .catch((error: unknown) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2023') {
            throw new HttpError('Invalid news id', 500);
          }
        }

        throw error;
      });

    if (!news) {
      throw new HttpError('News not found', 404);
    }

    res.json({
      status: 'success',
      data: news,
    });
  };
}
