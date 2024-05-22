import { HttpError } from '@src/errors';
import type { NextFunction, Request, Response } from 'express';
import getPaymentTypeSchema from '../components/payment-methods/utils/get-payment-type-schema';

async function validatePaymentData(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  if (!Object.keys(req.body).length) {
    throw new HttpError("Request body can't be empty", 400);
  }

  const schema = getPaymentTypeSchema(req.body.type, req.method);

  const output = schema?.safeParse(req.body);

  if (!output?.success) {
    const details = output!.error.issues.map((issue) => {
      const { message } = issue;

      return {
        paymentMethodType: req.body.type,
        path: issue?.path,
        message,
      };
    });

    throw new HttpError('Invalid request', 400, details);
  }

  req.body = output.data;
  next();
}

export default validatePaymentData;
