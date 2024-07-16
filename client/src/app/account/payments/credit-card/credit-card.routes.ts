import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../credit-card/credit-card.component').then(
        c => c.CreditCardComponent
      ),
  },
  {
    path: 'add',
    data: { breadcrumb: 'Add' },
    loadComponent: () =>
      import('./add-credit-card/add-card.component').then(
        c => c.AddCreditCardComponent
      ),
  },
  {
    path: ':id',
    data: { breadcrumb: 'Update' },
    loadComponent: () =>
      import('./update-credit-card/update-card.component').then(
        c => c.UpdateCreditCardComponent
      ),
  },
  {
    path: '',
    redirectTo: 'credit-card',
    pathMatch: 'full',
  },
];
