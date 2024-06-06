import { Router } from 'express';
import { getAllProducts } from '@src/api/components/products/controllers/all-products';
import type { Dependecies } from '@src/config/dependencies';
import { getProductById } from '@src/api/components/products/controllers/single-product';
import { getAllCategories } from './controllers/categories';
import { addProductDiscount } from './controllers/add-discount';
import validate from '@src/api/middleware/validate';
import { addDiscountSchema } from '@src/schemas/products';
import { auth } from '@src/api/middleware/auth';
import { getBestsellers } from './controllers/bestsellers';
import { getAllDiscountedProducts } from './controllers/all-products-on-sale';

export function productsRouter(deps: Dependecies) {
  const router = Router();

  router.get('/', getAllProducts(deps));
  router.get('/categories', getAllCategories(deps));
  router.get('/bestsellers', getBestsellers(deps));
  router.get('/sale', getAllDiscountedProducts(deps));
  router.get('/:id', getProductById(deps));
  router.post(
    '/discount',
    [auth(deps, 'admin'), validate(addDiscountSchema)],
    addProductDiscount(deps),
  );

  return router;
}
