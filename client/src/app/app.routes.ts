import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.routes),
  },
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then(c => c.HomeComponent),
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
