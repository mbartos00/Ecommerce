import type { Dependecies } from '@src/config/dependencies';
import type { Response } from 'express';
import { REFRESH_TOKEN_COOKIE_NAME } from '../constants';
import type { ResponseFormat } from '@src/types/response';

export function logout({ prisma }: Dependecies) {
  return async (res: Response<ResponseFormat>) => {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    res.status(200).json({ status: 'success' });
  };
}
