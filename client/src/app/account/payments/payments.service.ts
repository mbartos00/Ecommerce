import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import {
  PaymentType,
  PaymentTypeResponse,
  PaymentTypesEnum,
} from '@app/shared/types/payments.model';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  paymentMethods$!: Observable<PaymentType[]>;

  private http = inject(HttpClient);

  constructor() {
    this.paymentMethods$ = this.getAllPaymentMethods();
  }

  getAllPaymentMethods(): Observable<PaymentType[]> {
    return this.http
      .get<PaymentTypeResponse>(environment.API_URL + '/payment-methods')
      .pipe(map(d => d.data));
  }

  addPaymentMethod(data: Partial<PaymentType>): Observable<PaymentType> {
    return this.http.post<PaymentType>(
      environment.API_URL + '/payment-methods/add',
      {
        ...data,
      }
    );
  }

  updatePaymentMethod(data: Partial<PaymentType>): Observable<PaymentType> {
    return this.http.patch<PaymentType>(
      environment.API_URL + '/payment-methods/update',
      {
        ...data,
      }
    );
  }

  removePaymentMethod(id: string): Observable<void> {
    return this.http.delete<void>(
      environment.API_URL + '/payment-methods/remove',
      {
        body: {
          id,
        },
      }
    );
  }

  getAllUniquePaymentTypes(): Observable<PaymentTypesEnum[]> {
    return this.http
      .get<PaymentTypeResponse>(environment.API_URL + '/payment-methods')
      .pipe(
        map(response => {
          const paymentMethods = response.data;

          return paymentMethods
            .filter(
              (obj1, i, arr) =>
                arr.findIndex(obj2 => obj2.type === obj1.type) === i
            )
            .map(i => i.type);
        })
      );
  }
}
