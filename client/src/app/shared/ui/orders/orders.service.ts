import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '@app/shared/types/order';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';

interface ApiResponse<T extends Order | Order[]> {
  status: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private apiUrl = environment.API_URL + '/orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http
      .get<ApiResponse<Order[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  getOrderForUser(userId: string): Observable<Order[]> {
    return this.http
      .get<ApiResponse<Order[]>>(`${this.apiUrl}/${userId}`)
      .pipe(map(response => response.data));
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http
      .get<ApiResponse<Order>>(`${this.apiUrl}/details/${orderId}`)
      .pipe(map(response => response.data));
  }

  getTotalVariants(order: Order): number {
    return order.orderProducts.reduce(
      (total, product) => total + product.quantityToBuy,
      0
    );
  }
}
