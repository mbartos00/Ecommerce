import { login } from '@src/api/components/auth/controllers/login';
import { register } from '@src/api/components/auth/controllers/register';
import { auth } from '@src/api/middleware/auth';
import validate from '@src/api/middleware/validate';
import type { Dependecies } from '@src/config/dependencies';
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
} from '@src/schemas/auth';
import { Router } from 'express';
import { deleteUser } from './controllers/delete-user';
import { getUserData } from './controllers/get-user-data';
import { updateUser } from './controllers/update-user';

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

  return router;
}
