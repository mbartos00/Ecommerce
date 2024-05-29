import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { Request, Response } from 'express';

export function updateAddress({ prisma }: Dependecies) {
  return async (req: Request, res: Response) => {
    const { ...addressData } = req.body;

    const { id } = req.params;

    try {
      const updatedAddress = await prisma.address.update({
        where: {
          id,
        },
        data: addressData,
      });

      res.json({ status: 'success', data: updatedAddress });
    } catch (error) {
      console.log(error);
      throw new HttpError('Unable to update address', 500);
    }
  };
}
