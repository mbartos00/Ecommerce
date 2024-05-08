import { Router } from 'express';
import type { Dependecies } from '@src/config/dependencies';
import validate from '@src/api/middleware/validate';
import { loginSchema, registerSchema } from '@src/schemas/auth';
import { register } from '@src/api/components/auth/controllers/register';
import { login } from '@src/api/components/auth/controllers/login';
import { refreshToken } from './controllers/refresh-token';
import { logout } from './controllers/logout';

export function authRouter(deps: Dependecies) {
  const router = Router();

  router.post('/register', validate(registerSchema), register(deps));
  router.post('/login', validate(loginSchema), login(deps));
  router.get('/refresh-token', refreshToken(deps));
  router.get('/logout', logout(deps));

  return router;
}
