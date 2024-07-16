import type { Dependecies } from '@src/config/dependencies';
import { Router } from 'express';
import { deleteOrder } from './controllers/detele-order';
import { getOrders } from './controllers/get-orders';
import { auth } from '@src/api/middleware/auth';
import { idValidation } from '@src/schemas/auth';
import validate from '@src/api/middleware/validate';
import { getOrdersByUser } from './controllers/get-orders-by-user';
import { getOrderById } from './controllers/get-order-by-id';

export function ordersRouter(deps: Dependecies) {
  const router = Router();

  router.get('/', auth(deps, 'admin'), getOrders(deps));
  router.get('/:id', auth(deps), getOrdersByUser(deps));
  router.get('/details/:orderId', auth(deps), getOrderById(deps));
  router.delete(
    '/delete',
    [auth(deps, 'admin'), validate(idValidation)],
    deleteOrder(deps),
  );

  return router;
}
