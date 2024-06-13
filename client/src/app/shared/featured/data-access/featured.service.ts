import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ProductList } from '@app/shared/types/product.model';

@Injectable({
  providedIn: 'root',
})
export class FeaturedService {
  private api = `${environment.API_URL}/products`;

  constructor(private http: HttpClient) {}

  getFeaturedProducts(): Observable<ProductList> {
    return this.http.get<ProductList>(`${this.api}/featured`);
  }
}
