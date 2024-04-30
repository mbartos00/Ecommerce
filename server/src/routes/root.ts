import { Router } from 'express';

import type { Dependecies } from '../config/dependencies';
import { productsRouter } from './products';
import { authRouter } from './auth';

export function rootRouter(deps: Dependecies) {
  const router = Router();

  router.use('/auth', authRouter(deps));
  router.use('/products', productsRouter(deps));

  return router;
}
