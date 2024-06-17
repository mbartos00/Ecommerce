import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'login',
    data: { breadcrumb: 'Login' },
    loadComponent: () =>
      import('./login/login.component').then(c => c.LoginComponent),
  },
  {
    path: 'register',
    data: { breadcrumb: 'Register' },
    loadComponent: () =>
      import('./signup/signup.component').then(c => c.SignupComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
