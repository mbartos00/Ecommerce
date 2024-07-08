import { Router } from 'express';
import type { Dependecies } from '@src/config/dependencies';
import { checkout } from './controllers/checkout';
import { auth } from '@src/api/middleware/auth';
import { checkoutSchema } from '@src/schemas/checkout';
import validate from '@src/api/middleware/validate';

export function checkoutRouter(deps: Dependecies) {
  const router = Router();

  router.post('/', [auth(deps), validate(checkoutSchema)], checkout(deps));

  return router;
}
