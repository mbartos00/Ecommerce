import { Router } from 'express';
import type { Dependecies } from '../config/dependencies';
import {
  getAllProducts,
  getProductById,
} from '@src/controllers/products/products';

export function productsRouter(deps: Dependecies) {
  const router = Router();

  router.get('/', getAllProducts(deps));
  router.get('/:id', getProductById(deps));

  return router;
}
