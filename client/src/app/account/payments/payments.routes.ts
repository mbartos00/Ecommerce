import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./payments.component').then(c => c.PaymentsComponent),
  },
  {
    path: 'paypal',
    data: { breadcrumb: 'Paypal' },
    loadChildren: () => import('./paypal/paypal.routes').then(m => m.routes),
  },
  {
    path: 'credit-card',
    data: { breadcrumb: 'Credit Card' },
    loadChildren: () =>
      import('./credit-card/credit-card.routes').then(m => m.routes),
  },
  {
    path: 'bank-transfer',
    data: { breadcrumb: 'Bank Transfer' },
    loadChildren: () =>
      import('./bank-transfer/bank-transfer.routes').then(m => m.routes),
  },
  {
    path: '',
    redirectTo: 'payments',
    pathMatch: 'full',
  },
];
