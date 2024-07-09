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
];
