import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { Request, Response } from 'express';

type RequestType = {
  id: string;
};

export function removeFavorite({ prisma }: Dependecies) {
  return async (req: Request<RequestType>, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const favorites = await prisma.favorites.findUnique({
      where: { userId },
      include: { products: true },
    });

    if (!favorites) {
      throw new HttpError('The favourites list does not exist', 404);
    }

    const favoriteProduct = await prisma.favorites.findFirst({
      where: {
        userId,
        products: { some: { id } },
      },
    });

    if (!favoriteProduct) {
      throw new HttpError('The product does not exist on the list', 404);
    }

    try {
      const updatedFavorites = await prisma.favorites.update({
        where: { userId },
        data: {
          products: {
            disconnect: { id },
          },
        },
        include: { products: true },
      });

      res.json({
        status: 'success',
        data: updatedFavorites,
      });
    } catch (error) {
      console.error(error);
      throw new HttpError('Unable to delete favorite product', 500);
    }
  };
}
