import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../types/product.model';
import { environment } from '../../../environments/environment';

interface ApiResponse {
  status: string;
  data: Product;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = environment.API_URL + '/products';

  constructor(private http: HttpClient) {}

  getProductById(productId: string): Observable<Product> {
    const url = `${this.apiUrl}/${productId}`;

    return this.http.get<ApiResponse>(url).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  private handleError(error: Error): Observable<never> {
    console.error('An error occurred:', error);

    throw error;
  }
}
