import type { Dependecies } from '@src/config/dependencies';
import type { Request, Response } from 'express';
import { HttpError } from '@src/errors';

export function addFavorite({ prisma }: Dependecies) {
  return async (req: Request, res: Response) => {
    const { productId } = req.body;
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites_list: {
          include: { products: true },
        },
      },
    });

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new HttpError('Product not found', 404);
    }

    if (user.favorites_list?.products.some((p) => p.id === productId)) {
      throw new HttpError('Product is already in favorites', 400);
    }

    try {
      let updatedFavorites;

      if (!user.favorites_list) {
        updatedFavorites = await prisma.favorites.create({
          data: {
            user: { connect: { id: userId } },
            products: {
              connect: { id: productId },
            },
          },
          include: { products: true },
        });
      } else {
        updatedFavorites = await prisma.favorites.update({
          where: { id: user.favorites_list.id },
          data: {
            products: {
              connect: { id: productId },
            },
          },
          include: { products: true },
        });
      }

      res.json({
        status: 'success',
        data: updatedFavorites,
      });
    } catch (error) {
      console.error(error);
      throw new HttpError('Failed to add product to favorites', 500);
    }
  };
}
