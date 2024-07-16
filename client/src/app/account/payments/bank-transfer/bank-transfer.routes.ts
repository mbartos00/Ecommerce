import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./bank-transfer.component').then(c => c.BankTransferComponent),
  },
  {
    path: 'add',
    data: { breadcrumb: 'Add' },
    loadComponent: () =>
      import('./add-bank-transfer/add-bank-transfer.component').then(
        c => c.AddBankTransferComponent
      ),
  },
  {
    path: ':id',
    data: { breadcrumb: 'Update' },
    loadComponent: () =>
      import('./update-bank-transfer/update-bank-transfer.component').then(
        c => c.UpdateBankTransferComponent
      ),
  },

  {
    path: '',
    redirectTo: 'bank-transfer',
    pathMatch: 'full',
  },
];
