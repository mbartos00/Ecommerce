import { Router } from 'express';
import type { Dependecies } from '../config/dependencies';
import validate from '@src/middleware/validate';
import { loginSchema, registerSchema } from '@src/schemas/auth';
import { register } from '@src/controllers/auth/register';
import { login } from '@src/controllers/auth/login';

export function authRouter(deps: Dependecies) {
  const router = Router();

  router.post('/register', validate(registerSchema), register(deps));
  router.post('/login', validate(loginSchema), login(deps));

  return router;
}
