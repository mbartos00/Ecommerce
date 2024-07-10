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
    path: 'change-phone-number',
    data: { breadcrumb: 'Phone Number' },
    loadComponent: () =>
      import('./change-phone-number/change-phone-number.component').then(
        c => c.ChangePhoneNumberComponent
      ),
  },
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
];
