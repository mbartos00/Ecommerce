import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { Request, Response } from 'express';

type RequestType = {
  id: string;
};

export function deleteUser({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, RequestType>, res: Response) => {
    const { id } = req.user!;

    try {
      await prisma.user.delete({
        where: {
          id,
        },
      });

      res.json({ status: 'success' });
    } catch (error) {
      throw new HttpError('Unable to delete user', 500);
    }
  };
}
