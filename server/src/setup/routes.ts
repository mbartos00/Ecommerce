import { type Express } from 'express';
import { rootRouter } from '../routes/root';
import type { Dependecies } from '../config/dependencies';

export function setupRoutes(app: Express, deps: Dependecies) {
  app.use('/api', rootRouter(deps));
}
