import { Route } from '@angular/router';
import { ProductResolver } from '@app/shared/product/product.resolver';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./shop.component').then(c => c.ShopComponent),
  },
  {
    path: ':id',
    resolve: { breadcrumb: ProductResolver },
    loadComponent: () =>
      import('../shared/product-info/product-info.component').then(
        c => c.ProductInfoComponent
      ),
  },
  {
    path: '',
    redirectTo: 'shop',
    pathMatch: 'full',
  },
];
