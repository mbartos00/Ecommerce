import { Routes } from '@angular/router';
import { CartComponent } from './shared/cart/cart.component';

export const routes: Routes = [
  {
    path: 'auth',
    data: { breadcrumb: 'Auth' },
    loadChildren: () => import('./auth/auth.routes').then(m => m.routes),
  },
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then(c => c.HomeComponent),
  },
  { path: 'cart', component: CartComponent, data: { breadcrumb: 'Cart' } },
  {
    path: 'shop',
    data: { breadcrumb: 'Shop' },
    loadChildren: () => import('./shop/shop.routes').then(m => m.routes),
  {
    path: 'contact',
    data: { breadcrumb: 'Contact' },
    loadComponent: () =>
      import('./contact/contact-form.component').then(
        c => c.ContactFormComponent)
  },
  {
    path: 'best',
    data: { breadcrumb: 'Bestseller' },
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
