import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BestSellerList } from '@app/shared/types/product.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BestsellerService {
  private apiUrl = `${environment.API_URL}/products/bestsellers`;

  constructor(private http: HttpClient) {}

  getBestSellers(): Observable<BestSellerList> {
    return this.http.get<BestSellerList>(this.apiUrl);
  }

  getBestSellersByCategory(
    category: string = 'all'
  ): Observable<BestSellerList> {
    let params = new HttpParams();

    if (category !== 'all') {
      params = params.set('category', category);
    }

    return this.http.get<BestSellerList>(this.apiUrl, {
      params,
      responseType: 'json',
    });
  }
}
