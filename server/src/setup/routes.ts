import type { Express } from 'express';

import type { Dependecies } from '../config/dependencies';
import { rootRouter } from '../routes/root';
import { authRouter } from '@src/routes/auth';

export function setupRoutes(app: Express, deps: Dependecies) {
  app.use('/api', rootRouter(deps));
  app.use('/api', authRouter(deps));
}
