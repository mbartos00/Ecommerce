import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
      .get<ProductList>(`${environment.API_URL}/products`, {
        params: this.removeEmptyPropsFromObj(params),
      })
      .pipe(catchError(this.handleError));
  }

  getProductById(productId: string): Observable<Product> {
    const url = `${this.apiUrl}/${productId}`;

    return this.http.get<ApiResponse<Product>>(url).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getProductsOnSale(): Observable<Product[]> {
    const url = `${this.apiUrl}/sale`;
    return this.http.get<ApiResponse<Product[]>>(url).pipe(
      map(response => response.data.slice(0, 3)),
      catchError(this.handleError)
    );
  }

  private handleError(error: Error): Observable<never> {
    console.error('An error occurred:', error);

    throw error;
  }

  private removeEmptyPropsFromObj<T extends object>(obj: T): T {
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v != null)
    ) as T;
  }
}
