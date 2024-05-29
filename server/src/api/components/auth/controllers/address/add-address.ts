import type { Address } from '@prisma/client';
import type { Dependecies } from '@src/config/dependencies';
import { HttpError } from '@src/errors';
import type { Request, Response } from 'express';

type AddressReq = Omit<Address, 'id' | 'userId'>;

export function addAddress({ prisma }: Dependecies) {
  return async (req: Request<{}, {}, AddressReq>, res: Response) => {
    try {
      const { ...addressData } = req.body;
      const id = req.user!.id;

      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new HttpError('User not found', 404);
      }

      const createdAddress = await prisma.address.create({
        data: {
          ...addressData,
          user: { connect: { id } },
        },
      });

      res.json({ status: 'success', data: createdAddress });
    } catch (error) {
      throw new HttpError('Failed to create address', 500);
    }
  };
}
