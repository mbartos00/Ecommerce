import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Category {
  id: string;
  name: string;
}

interface ApiResponse {
  status: string;
  data: Category[];
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrl = environment.API_URL + '/products/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http
      .get<ApiResponse>(this.apiUrl)
      .pipe(map(response => response.data));
  }
}
