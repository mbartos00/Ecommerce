import { authRouter } from '@src/api/components/auth/route';
import { productsRouter } from '@src/api/components/products/route';
import { newsRouter } from '@src/api/components/news/route';
import { cartRouter } from '../components/cart/route';
import { paymentMethodsRouter } from '@src/api/components/payment-methods/route';
import type { Express } from 'express';
import type { Dependecies } from '../../config/dependencies';
import { contactRouter } from '../components/contact-form/route';

export function setupRoutes(app: Express, deps: Dependecies, prefix = '/api') {
  app.use(prefix, authRouter(deps));
  app.use(`${prefix}/products`, productsRouter(deps));
  app.use(`${prefix}/news`, newsRouter(deps));
  app.use(`${prefix}/cart`, cartRouter(deps));
  app.use(`${prefix}/payment-methods`, paymentMethodsRouter(deps));
  app.use(`${prefix}/contact`, contactRouter(deps));
}
