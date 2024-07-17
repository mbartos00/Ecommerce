import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { environment } from '@environments/environment.development';
import { Favorites } from '@app/shared/types/favorite';
import { User } from '@app/shared/types/user';
import { Product } from '@app/shared/types/product.model';
import { UserService } from '@app/shared/data-access/user.service';

interface ApiResponse<T> {
  status: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = `${environment.API_URL}/user/favorites`;
  private favoriteListSubject = new BehaviorSubject<Favorites>({
    id: '',
    user: {} as User,
    userId: '',
    products: [],
  });

  // eslint-disable-next-line @typescript-eslint/member-ordering
  favoriteList$ = this.favoriteListSubject.asObservable();

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.userService.user$
      .pipe(
        take(2),
        tap(d => {
          if (d.isAuth) {
            this.initializeFavorites();
          }
        })
      )
      .subscribe();
  }

  getFavorites(): Observable<Favorites> {
    return this.http.get<ApiResponse<Favorites>>(this.apiUrl).pipe(
      map(response => response.data),
      tap(favorites => this.favoriteListSubject.next(favorites)),
      catchError(this.handleError)
    );
  }

  addFavorite(productId: string): Observable<ApiResponse<Favorites>> {
    return this.http
      .post<ApiResponse<Favorites>>(this.apiUrl, { productId })
      .pipe(
        tap(data => {
          const updatedFavorites = {
            ...this.favoriteListSubject.value,
            products: [...data.data.products],
          };
          this.favoriteListSubject.next(updatedFavorites);
        }),
        catchError(this.handleError)
      );
  }

  removeFavorite(productId: string): Observable<Product> {
    return this.http
      .delete<ApiResponse<Product>>(`${this.apiUrl}/${productId}`)
      .pipe(
        map(response => response.data),
        tap(() => {
          const updatedFavorites = {
            ...this.favoriteListSubject.value,
            products: this.favoriteListSubject.value.products.filter(
              p => p.id !== productId
            ),
          };
          this.favoriteListSubject.next(updatedFavorites);
        }),
        catchError(this.handleError)
      );
  }

  isFavorite(productId: string): boolean {
    return this.favoriteListSubject?.value.products.some(
      item => item.id === productId
    );
  }

  private initializeFavorites(): void {
    this.getFavorites().subscribe();
  }

  private handleError(error: Error): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(
      () =>
        new Error(
          error.message || 'Something went wrong; please try again later.'
        )
    );
  }
}
