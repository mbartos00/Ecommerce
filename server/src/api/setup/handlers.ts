import { errorHandler } from '@src/api/middleware/error-handler';
import { notFound } from '@src/api/middleware/not-found';
import type { Express } from 'express';

export function setupHandlers(app: Express) {
  app.use(errorHandler);
  app.use(notFound);
}
