import { Router } from 'express';
import type { Dependecies } from '@src/config/dependencies';
import { getShipping } from './controllers/get-shipping';

export function cartRouter(deps: Dependecies) {
  const router = Router();

  router.get('/shipping', getShipping(deps));

  return router;
}
