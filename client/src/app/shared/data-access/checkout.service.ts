import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Address } from '@app/shared/types/address';
import { PaymentMethod, PaymentTypeKey } from '../types/payment';
import { Checkout } from '../types/product.model';
import { environment } from '@environments/environment';

interface ApiResponse {
  status: string;
  data: Address[];
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private http: HttpClient) {}

  getUserAddresses(): Observable<Address[]> {
    return this.http
      .get<ApiResponse>(environment.API_URL + '/user/addresses')
      .pipe(map(response => response.data));
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http
      .get<{
        status: string;
        data: PaymentMethod[];
      }>(environment.API_URL + '/user/payment-methods')
      .pipe(map(response => response.data));
  }

  getUserPaymentMethodsByType(
    type: PaymentTypeKey
  ): Observable<PaymentMethod[]> {
    return this.getPaymentMethods().pipe(
      map(methods => methods.filter(method => method.type === type))
    );
  }

  submitCheckout(data: Checkout): Observable<Checkout> {
    return this.http
      .post<Checkout>(environment.API_URL + '/checkout', data)
      .pipe(map(response => response));
  }
}
