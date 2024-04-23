import { errorHandler } from '@src/middleware/error-handler';
import { notFound } from '@src/middleware/not-found';
import { type Express } from 'express';

export function setupHandlers(app: Express) {
  app.use(errorHandler);
  app.use(notFound);
}
