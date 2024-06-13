import type { Dependecies } from '@src/config/dependencies';
import type { Request, Response } from 'express';
import { HttpError } from '@src/errors';

export function getFavorites({ prisma }: Dependecies) {
  return async (req: Request, res: Response) => {
    const userId = req.user!.id;

    try {
      const favorites = await prisma.favorites.findUnique({
        where: { userId },
        include: { products: true },
      });

      res.json({
        status: 'success',
        data: favorites,
      });
    } catch (error) {
      console.error(error);
      throw new HttpError('An unexpected server error occurred', 500);
    }
  };
}
