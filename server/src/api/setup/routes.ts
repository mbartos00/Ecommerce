import { authRouter } from '@src/api/components/auth/route';
import { productsRouter } from '@src/api/components/products/route';
import type { Express } from 'express';
import type { Dependecies } from '../../config/dependencies';
import { newsRouter } from '../components/news/route';

export function setupRoutes(app: Express, deps: Dependecies, prefix = '/api') {
  app.use(prefix, authRouter(deps));
  app.use(`${prefix}/products`, productsRouter(deps));
  app.use(`${prefix}/news`, newsRouter(deps));
}
