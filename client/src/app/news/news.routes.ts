import { Route } from '@angular/router';
import { NewsResolver } from '@app/shared/news/data-access/news.resolver';

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
  {
    path: ':id',
    resolve: { breadcrumb: NewsResolver },
    loadComponent: () =>
      import('../shared/news/news-details.component').then(
        c => c.NewsDetailsComponent
      ),
  },
];
