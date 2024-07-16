import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdersService } from './orders.service';
import { Order } from '@app/shared/types/order';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '@app/shared/data-access/user.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ordersList.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit {
  orders$: Observable<Order[]> = new Observable<Order[]>();

  constructor(
    private ordersService: OrdersService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.orders$ = this.ordersService.getOrderForUser(
      this.userService.getUserId()!
    );
  }

  getTotalVariants(order: Order): number {
    return this.ordersService.getTotalVariants(order);
  }
}
