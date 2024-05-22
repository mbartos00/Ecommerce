import { auth } from '@src/api/middleware/auth';
import validate from '@src/api/middleware/validate';
import validatePaymentData from '@src/api/middleware/validatePaymentData';
import type { Dependecies } from '@src/config/dependencies';
import { deleteMethodSchema } from '@src/schemas/paymentMethods';
import { Router } from 'express';
import { addPaymentMethod } from './controllers/add-payment-method';
import { getAllUserMethods } from './controllers/get-all-user-methods';
import { removePaymentMethod } from './controllers/remove-payment-method';
import { updatePaymentMethod } from './controllers/update-payment-method';

export function paymentMethodsRouter(deps: Dependecies) {
  const router = Router();

  router.get('/', auth(deps), getAllUserMethods(deps));
  router.post(
    '/add',
    [auth(deps), validatePaymentData],
    addPaymentMethod(deps),
  );
  router.delete(
    '/remove',
    [auth(deps), validate(deleteMethodSchema)],
    removePaymentMethod(deps),
  );
  router.patch(
    '/update',
    [auth(deps), validatePaymentData],
    updatePaymentMethod(deps),
  );

  return router;
}
