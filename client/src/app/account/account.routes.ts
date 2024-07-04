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
    loadComponent: () =>
      import('./profile/profile.component').then(c => c.ProfileComponent),
  },
];
