import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    data: { breadcrumb: 'Account' },
    loadComponent: () =>
      import('./account.component').then(c => c.AccountComponent),
  },
  {
    path: 'profile',
    data: { breadcrumb: 'Profile' },
    loadChildren: () => import('./profile/profile.routes').then(m => m.routes),
  },
  {
    path: 'orders',
    data: { breadcrumb: 'Orders' },
    loadChildren: () =>
      import('../shared/ui/orders/orders.routes').then(m => m.routes),
  },
  {
    path: 'payments',
    data: { breadcrumb: 'Payments' },
    loadChildren: () =>
      import('./payments/payments.routes').then(m => m.routes),
  },
  {
    path: 'address',
    data: { breadcrumb: 'Address' },
    loadChildren: () => import('./address/address.routes').then(m => m.routes),
  },
];
