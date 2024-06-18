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
  addFavoriteSchema,
} from '@src/schemas/auth';
import { Router } from 'express';
import { deleteUser } from './controllers/user/delete-user';
import { getUserData } from './controllers/user/get-user-data';
import { updateUser } from './controllers/user/update-user';
import { getAllAddresses } from './controllers/address/get-addresses';
import { addAddress } from './controllers/address/add-address';
import { removeAddress } from './controllers/address/remove-address';
import { updateAddress } from './controllers/address/update-addres';
import { getFavorites } from './controllers/favorites/get-favorites';
import { addFavorite } from './controllers/favorites/add-favorites';
import { removeFavorite } from './controllers/favorites/remove-favorites';
import upload from '@src/config/multer';

export function authRouter(deps: Dependecies) {
  const router = Router();
  const uploadFile = upload();

  router.post(
    '/register',
    [uploadFile.single('avatar'), validate(registerSchema)],
    register(deps),
  );
  router.post('/login', validate(loginSchema), login(deps));

  router.get('/user', auth(deps), getUserData(deps));
  router.patch(
    '/user/update',
    [auth(deps), uploadFile.single('avatar'), validate(updateUserSchema)],
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
  router.post(
    '/user/favorites',
    [auth(deps), validate(addFavoriteSchema)],
    addFavorite(deps),
  );
  router.get('/user/favorites', auth(deps), getFavorites(deps));
  router.delete('/user/favorites/:id', auth(deps), removeFavorite(deps));

  return router;
}
