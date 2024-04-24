import type { Express } from 'express';

import type { Dependecies } from '../config/dependencies';
import { rootRouter } from '../routes/root';

export function setupRoutes(app: Express, deps: Dependecies) {
  app.use('/api', rootRouter(deps));
}
