import type { ErrorResponseFormat } from '@src/types/response';
import type { Request, Response } from 'express';

export function notFound(_: Request, res: Response<ErrorResponseFormat>) {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
  });
}
