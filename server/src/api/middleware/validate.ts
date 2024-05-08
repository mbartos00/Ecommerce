import { HttpError } from '@src/errors';
import type { NextFunction, Request, Response } from 'express';
import type { Schema } from 'zod';

type Detail = {
  message: string;
  path: string;
};

export default function validate<T>(schema: Schema<T>) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const output = schema.safeParse(req.body);

    if (!output.success) {
      const details: Detail[] = output.error.issues.map((issue) => {
        const path = issue.path.join('.');
        const { message } = issue;

        return {
          path,
          message,
        };
      });

      throw new HttpError('Invalid request', 400, details);
    }

    req.body = output.data;
    next();
  };
}
