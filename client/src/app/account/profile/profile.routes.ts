import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./profile.component').then(c => c.ProfileComponent),
  },
  {
    path: 'change-email',
    data: { breadcrumb: 'Email' },
    loadComponent: () =>
      import('./change-email/change-email.component').then(
        c => c.ChangeEmailComponent
      ),
  },
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
];
