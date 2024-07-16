import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Order } from '@app/shared/types/order';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orderDetails.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailsComponent implements OnInit {
  order$: Observable<Order> = new Observable<Order>();
  showAll = false;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.order$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(orderId => this.ordersService.getOrderById(orderId))
    );
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }

  getTotalVariants(order: Order): number {
    return this.ordersService.getTotalVariants(order);
  }
}
