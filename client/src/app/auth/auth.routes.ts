import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(c => c.LoginComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
