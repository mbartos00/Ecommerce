import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./address.component').then(c => c.AddressComponent),
  },
  {
    path: 'add-address',
    data: { breadcrumb: 'Add address' },
    loadComponent: () =>
      import('./addAddress/add-address.component').then(
        c => c.AddAddressComponent
      ),
  },
  {
    path: 'edit-address/:id',
    data: { breadcrumb: 'Edit address' },
    loadComponent: () =>
      import('./editAddress/edit-address.component').then(
        c => c.EditAddressComponent
      ),
  },
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
];
