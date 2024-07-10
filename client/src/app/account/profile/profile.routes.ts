import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./profile.component').then(c => c.ProfileComponent),
  },
  {
    path: 'name',
    data: { breadcrumb: 'Name' },
    loadComponent: () =>
      import('./name/name.component').then(c => c.NameComponent),
  },
  {
    path: 'gender',
    data: { breadcrumb: 'Gender' },
    loadComponent: () =>
      import('./gender/gender.component').then(c => c.GenderComponent),
  },
  {
    path: 'birthday',
    data: { breadcrumb: 'Birthday' },
    loadComponent: () =>
      import('./birthday/birthday.component').then(c => c.BirthdayComponent),
  },
  {
    path: 'password',
    data: { breadcrumb: 'Password' },
    loadComponent: () =>
      import('./password/password.component').then(c => c.PasswordComponent),
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
