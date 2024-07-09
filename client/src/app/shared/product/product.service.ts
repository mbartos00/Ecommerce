/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Filter,
  Product,
  ProductList,
  QueryParams,
} from '../types/product.model';
import { environment } from '../../../environments/environment';

interface ApiResponse<T extends Product | Product[] | Filter> {
  status: string;
  data: T;
}

export type Filters = {
  brand: string[];
  color: string[];
  condition: string[];
  price: {
    min: number;
    max: number;
  };
  size: string[];
};

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = environment.API_URL + '/products';

  constructor(private http: HttpClient) {}

  getAllProducts(params: QueryParams): Observable<ProductList> {
    return this.http
      .get<ProductList>(this.apiUrl, {
        params: this.removeEmptyPropsFromObj(params),
      })
      .pipe(
        catchError(error =>
          this.handleError<ProductList>(error, {
            status: 'error',
            paginationInfo: {
              count: 0,
              page: 0,
              perPage: 0,
              totalPages: 0,
            },
            data: [],
          })
        )
      );
  }

  getProductById(productId: string): Observable<Product> {
    const url = `${this.apiUrl}/${productId}`;

    return this.http.get<ApiResponse<Product>>(url).pipe(
      map(response => response.data),
      catchError(error => this.handleError<Product>(error, {} as Product))
    );
  }

  getProductsOnSale(): Observable<Product[]> {
    const url = `${this.apiUrl}/sale`;
    return this.http.get<ApiResponse<Product[]>>(url).pipe(
      map(response => response.data.slice(0, 3)),
      catchError(error => this.handleError<Product[]>(error, []))
    );
  }

  getProductFilters(): Observable<Filters> {
    const url = `${this.apiUrl}/filters`;
    return this.http.get<ApiResponse<Filter>>(url).pipe(
      map(({ data }) => {
        const desiredOrder = ['xs', 's', 'm', 'l', 'xl', 'xxl'];

        const color = data.color.map(i => i.color);
        const size = data.size
          .map(i => i.size)
          .sort((a, b) => desiredOrder.indexOf(a) - desiredOrder.indexOf(b));
        const brand = data.brand
          .map(i => i.brand)
          .sort((a, b) => a.localeCompare(b));
        const price = {
          min: data.price._min.price,
          max: data.price._max.price,
        };
        const condition = data.condition.map(i => i.condition);

        return { color, size, brand, price, condition };
      }),
      catchError(error =>
        throwError(
          () =>
            new Error(error.error?.message || 'An unexpected error occurred.')
        )
      )
    );
  }

  private handleError<T>(error: HttpErrorResponse, result: T): Observable<T> {
    if (
      error.status === 404 &&
      error.error?.status === 'error' &&
      error.error?.message === 'No products found'
    ) {
      return of(result);
    }
    console.error('An error occurred:', error);
    return throwError(() => new Error('An unexpected error occurred.'));
  }

  private removeEmptyPropsFromObj<T extends object>(obj: T): T {
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v != null)
    ) as T;
  }
}
