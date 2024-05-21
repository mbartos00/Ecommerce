import { Router } from 'express';
import type { Dependecies } from '@src/config/dependencies';
import { applyDiscount } from './controllers/apply-discount';
import { getShipping } from './controllers/get-shipping';

export function cartRouter(deps: Dependecies) {
  const router = Router();

  router.post('/discount', applyDiscount(deps));
  router.get('/shipping', getShipping(deps));

  return router;
}
