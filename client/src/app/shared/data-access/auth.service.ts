import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@environments/environment';
import { toast } from 'ngx-sonner';
import { Observable, catchError, shareReplay, tap, throwError } from 'rxjs';
import { ACCESS_TOKEN_STORAGE_KEY } from '../constants';
import { ResponseFormat } from '../types/response';
import { LoginSchema, SignupSchema } from '../types/schemas';
import { User } from '../types/user';
import { saveAccessToken } from '../utils/tokens';
import { UserService } from './user.service';

type LoginResponse = ResponseFormat & {
  token: string;
  data: User;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  helper = new JwtHelperService();
  private http = inject(HttpClient);
  private router = inject(Router);
  private userService = inject(UserService);

  login(credentials: LoginSchema): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.API_URL}/login`, credentials)
      .pipe(
        tap(({ token, data: user }) => {
          saveAccessToken(token);

          this.userService.updateUserState(true, user);
        }),
        shareReplay()
      );
  }

  logout(): Observable<ResponseFormat> {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);

    this.userService.updateUserState(false, null);

    return this.http.get<ResponseFormat>(`${environment.API_URL}/logout`, {
      withCredentials: true,
    });
  }

  createAccount(credentials: SignupSchema): Observable<ResponseFormat> {
    const formData = new FormData();
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    for (const key in credentials) {
      formData.append(key, credentials[key as keyof typeof credentials]);
    }

    return this.http
      .post<ResponseFormat>(`${environment.API_URL}/register`, formData, {
        headers,
      })
      .pipe(
        tap(({ status }) => {
          console.log(status);
        }),
        shareReplay()
      );
  }

  getToken(): string {
    return localStorage.getItem('access_token') || '';
  }

  refreshToken(): Observable<{
    status: string;
    accessToken: string;
    user: Omit<User, 'password'>;
  }> {
    return this.http
      .get<{
        status: string;
        accessToken: string;
        user: Omit<User, 'password'>;
      }>(`${environment.API_URL}/refresh-token`, { withCredentials: true })
      .pipe(
        tap(response => {
          saveAccessToken(response.accessToken);
          this.userService.updateUserState(true, response.user);
        }),
        catchError(error => {
          this.logout();
          this.router.navigate(['/']).then(() => {
            toast.success('Logged out', {
              description: 'Session expired',
            });
          });

          return throwError(() => new Error(error.message));
        })
      );
  }
}
