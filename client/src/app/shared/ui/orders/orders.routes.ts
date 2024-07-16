import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./ordersList.component').then(c => c.OrderListComponent),
  },
  {
    path: ':id',
    data: { breadcrumb: 'Order Details' },
    loadComponent: () =>
      import('./orderInfo/orderDetails.component').then(
        c => c.OrderDetailsComponent
      ),
  },
];
