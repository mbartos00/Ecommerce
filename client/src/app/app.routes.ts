import { Routes } from '@angular/router';
import { CartComponent } from './shared/cart/cart.component';
import { ProductListComponent } from './shared/ui/product-list/product-list.component';
import { ProductInfoComponent } from './shared/product-info/product-info.component';

export const routes: Routes = [
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./auth/auth.routes').then(m => m.routes),
  // },
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then(c => c.HomeComponent),
  },
  { path: 'cart', component: CartComponent },
  { path: 'shop', component: ProductListComponent },
  { path: 'product/:id', component: ProductInfoComponent },
  {
    path: 'shop',
    loadComponent: () =>
      import('./shop/shop.component').then(c => c.ShopComponent),
  },
  {
    path: 'best',
    loadComponent: () =>
      import('./shared/bestseller-section/bestseller-section.component').then(
        c => c.BestsellerSectionComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
