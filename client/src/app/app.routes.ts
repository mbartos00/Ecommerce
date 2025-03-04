import { Routes } from '@angular/router';
import { CartComponent } from './shared/cart/cart.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { AuthGuard } from './shared/guards/auth.guard';

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
  },
  {
    path: 'news',
    data: { breadcrumb: 'News' },
    loadChildren: () => import('./news/news.routes').then(m => m.routes),
  },
  {
    path: 'contact',
    data: { breadcrumb: 'Contact' },
    loadComponent: () =>
      import('./contact/contact-form.component').then(
        c => c.ContactFormComponent
      ),
  },
  {
    path: 'news',
    data: { breadcrumb: 'News' },
    loadChildren: () => import('./news/news.routes').then(m => m.routes),
  },

  {
    path: 'account',
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Account' },
    loadChildren: () => import('./account/account.routes').then(m => m.routes),
  },
  {
    path: 'favorite-list',
    data: { breadcrumb: 'Favorite List' },
    loadComponent: () =>
      import('./favorite/favorite.component').then(c => c.FavoriteComponent),
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];
