import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { Request, Response } from 'express';

type RequestType = {
  id: string;
};

export function removeAddress({ prisma }: Dependecies) {
  return async (req: Request<RequestType>, res: Response) => {
    const { id } = req.params;

    try {
      await prisma.address.delete({
        where: {
          id,
        },
      });

      res.json({ status: 'success' });
    } catch (error) {
      throw new HttpError('Unable to delete address', 500);
    }
  };
}
