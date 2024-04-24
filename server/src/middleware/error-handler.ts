import { env } from '@src/config/env';
import { HttpError } from '@src/errors';
import type { ErrorResponseFormat } from '@src/types/response';
import type { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: unknown,
  _: Request,
  res: Response<ErrorResponseFormat<any>>,
  next: NextFunction,
) {
  if (env.ENV === 'development') {
    console.log(err);
  }

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
      message: 'Something went wrong',
    });
  }

  return res.status(400).json({
    status: 'error',
    message: 'Something went wrong',
  });
}
