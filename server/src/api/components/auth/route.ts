import { login } from '@src/api/components/auth/controllers/login';
import { register } from '@src/api/components/auth/controllers/register';
import { auth } from '@src/api/middleware/auth';
import validate from '@src/api/middleware/validate';
import type { Dependecies } from '@src/config/dependencies';
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
  addressSchema,
  updateAddressSchema,
} from '@src/schemas/auth';
import { Router } from 'express';
import { deleteUser } from './controllers/user/delete-user';
import { getUserData } from './controllers/user/get-user-data';
import { updateUser } from './controllers/user/update-user';
import { getAllAddresses } from './controllers/address/get-addresses';
import { addAddress } from './controllers/address/add-address';
import { removeAddress } from './controllers/address/remove-address';
import { updateAddress } from './controllers/address/update-addres';

export function authRouter(deps: Dependecies) {
  const router = Router();

  router.get('/user', auth(deps), getUserData(deps));
  router.post('/register', validate(registerSchema), register(deps));
  router.post('/login', validate(loginSchema), login(deps));
  router.patch(
    '/user/update',
    [auth(deps), validate(updateUserSchema)],
    updateUser(deps),
  );
  router.delete('/user/delete', auth(deps), deleteUser(deps));
  router.post(
    '/user/addresses',
    [auth(deps), validate(addressSchema)],
    addAddress(deps),
  );
  router.get('/user/addresses', auth(deps), getAllAddresses(deps));
  router.patch(
    '/user/addresses/:id',
    [auth(deps), validate(updateAddressSchema)],
    updateAddress(deps),
  );
  router.delete('/user/addresses/:id', auth(deps), removeAddress(deps));

  return router;
}
