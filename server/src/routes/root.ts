import { Router } from 'express';

import type { Dependecies } from '../config/dependencies';
import { register } from '../controllers/auth/register';

export function rootRouter(deps: Dependecies) {
  const router = Router();

  router.get('/', register(deps));

  return router;
}
