import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { LatestNews, News } from '@app/shared/types/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private api = `${environment.API_URL}/news`;
  private http = inject(HttpClient);

  getLatestNews(): Observable<News[]> {
    return this.http
      .get<LatestNews>(`${this.api}/latest`)
      .pipe(map(data => data.data));
  }
}
