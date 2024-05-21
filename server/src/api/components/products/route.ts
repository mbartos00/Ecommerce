import { Router } from 'express';
import { getAllProducts } from '@src/api/components/products/controllers/all-products';
import type { Dependecies } from '@src/config/dependencies';
import { getProductById } from '@src/api/components/products/controllers/single-product';
import { getAllCategories } from '../categories/controllers/categories';

export function productsRouter(deps: Dependecies) {
  const router = Router();

  router.get('/', getAllProducts(deps));
  router.get('/:id', getProductById(deps));
  router.get(`/categories`, getAllCategories(deps));

  return router;
}
