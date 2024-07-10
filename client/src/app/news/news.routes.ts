import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./news.component').then(c => c.NewsComponent),
  },

  {
    path: '',
    redirectTo: 'news',
    pathMatch: 'full',
  },
];
