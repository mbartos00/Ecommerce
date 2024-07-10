import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  News,
  NewsCategory,
  NewsList,
  QueryParams,
} from '@app/shared/types/news.model';

type NewsResponse =
  | News
  | News[]
  | Omit<NewsCategory, 'news'>
  | Omit<NewsCategory[], 'news'>;

interface ApiResponse<T extends NewsResponse> {
  status: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private apiUrl = environment.API_URL + '/news';

  constructor(private http: HttpClient) {}

  getAllNews(params: QueryParams): Observable<NewsList> {
    return this.http
      .get<NewsList>(this.apiUrl, {
        params: this.removeEmptyPropsFromObj(params),
      })
      .pipe(
        catchError(error =>
          this.handleError<NewsList>(error, {
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

  getNewsById(newsId: string): Observable<News> {
    const url = `${this.apiUrl}/${newsId}`;

    return this.http.get<ApiResponse<News>>(url).pipe(
      map(response => response.data),
      catchError(error => this.handleError<News>(error, {} as News))
    );
  }

  getNewsCategories(): Observable<Omit<NewsCategory[], 'news'>> {
    const url = `${this.apiUrl}/categories`;

    return this.http.get<ApiResponse<Omit<NewsCategory[], 'news'>>>(url).pipe(
      map(response => response.data),
      catchError(error =>
        this.handleError<Omit<NewsCategory[], 'news'>>(
          error,
          [] as Omit<NewsCategory[], 'news'>
        )
      )
    );
  }

  private handleError<T>(error: HttpErrorResponse, result: T): Observable<T> {
    if (
      error.status === 404 &&
      error.error?.status === 'error' &&
      error.error?.message === 'No news found'
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
