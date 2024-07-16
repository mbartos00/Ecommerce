import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../paypal/paypal.component').then(c => c.PaypalComponent),
  },
  {
    path: 'add',
    data: { breadcrumb: 'Add' },
    loadComponent: () =>
      import('./add-paypal/add-paypal.component').then(
        c => c.AddPaypalComponent
      ),
  },
  {
    path: ':id',
    data: { breadcrumb: 'Update' },
    loadComponent: () =>
      import('./update-paypal/update-paypal.component').then(
        c => c.UpdatePaypalComponent
      ),
  },
  {
    path: '',
    redirectTo: 'paypal',
    pathMatch: 'full',
  },
];
