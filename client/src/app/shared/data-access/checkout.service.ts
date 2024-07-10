// src/app/services/user-address.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Address } from '@app/shared/types/address';
import { PaymentMethod, PaymentTypeKey } from '../types/payment';

interface ApiResponse {
  status: string;
  data: Address[];
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private apiUrlAddress = 'http://localhost:8080/api/user/addresses';
  private apiUrlPayment = 'http://localhost:8080/api/payment-methods';

  constructor(private http: HttpClient) {}

  getUserAddresses(): Observable<Address[]> {
    return this.http
      .get<ApiResponse>(this.apiUrlAddress)
      .pipe(map(response => response.data));
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http
      .get<{ status: string; data: PaymentMethod[] }>(this.apiUrlPayment)
      .pipe(map(response => response.data));
  }

  getUserPaymentMethodsByType(
    type: PaymentTypeKey
  ): Observable<PaymentMethod[]> {
    return this.getPaymentMethods().pipe(
      map(methods => methods.filter(method => method.type === type))
    );
  }

  // TODO adjust to checkout endpoint on backend
  submitCheckout(data: any): Observable<any> {
    return this.http.post<any>('your-api-endpoint/checkout', data);
  }
}
