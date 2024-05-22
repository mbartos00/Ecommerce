import { HttpError } from '@src/errors';
import type { ErrorResponseFormat } from '@src/types/response';
import type { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response<ErrorResponseFormat<any>>,
  _: NextFunction,
) {
  if (err instanceof HttpError) {
    const { code, message, details } = err;

    return res.status(code).json({
      status: 'error',
      message,
      details,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      status: 'error',
      message: err.message ?? 'Something went wrong',
    });
  }

  return res.status(400).json({
    status: 'error',
    message: 'Something went wrong',
  });
}
