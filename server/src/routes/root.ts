import { Router } from 'express';
import type { Dependecies } from '../config/dependencies';
import { test } from '../controllers/test';

export function rootRouter(deps: Dependecies) {
  const router = Router();

  router.get('/', test(deps));

  return router;
}
