import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewsService } from './news.service';

@Injectable({ providedIn: 'root' })
export class NewsResolver {
  constructor(private newsService: NewsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<string | null> {
    const newsId = route.params['id'];

    return this.newsService
      .getNewsById(newsId)
      .pipe(map(product => (product ? product.title : null)));
  }
}
