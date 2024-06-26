import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, ProductList, QueryParams } from '../types/product.model';
import { environment } from '../../../environments/environment';

interface ApiResponse<T extends Product | Product[]> {
  status: string;
  data: T;
}

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
