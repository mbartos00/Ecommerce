import { HttpError } from '@src/errors';
import type { NextFunction, Request, Response } from 'express';
import type { Schema } from 'zod';

type Detail = {
  code: string;
  message: string;
  path: string;
};

export default function validate<T>(schema: Schema<T>) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const output = schema.safeParse(req.body);

    if (!output.success) {
      const details = output.error.issues.reduce<Detail[]>((acc, issue) => {
        const { message, code } = issue;
        const path = issue.path.join('.');

        if (path === '') {
          return acc;
        }

        return [...acc, { path, message, code }];
      }, []);

      throw new HttpError('Invalid request', 400, details);
    }

    req.body = output.data;
    next();
  };
}
