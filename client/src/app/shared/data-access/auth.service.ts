import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, shareReplay, tap } from 'rxjs';
import { ACCESS_TOKEN_STORAGE_KEY } from '../constants';
import { ResponseFormat } from '../types/response';
import { LoginSchema } from '../types/schemas';
import { User } from '../types/user';
import { getAccessToken, saveAccessToken } from '../utils/tokens';

type LoginResponse = ResponseFormat & {
  accessToken: string;
  user: User;
};

type UserResponse = ResponseFormat & {
  user: User;
};

type AuthState = {
  user: User | null;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authState = signal<AuthState>({
    user: null,
  });

  user = computed(() => this.authState().user);

  constructor() {
    const token = getAccessToken();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .get<UserResponse>(`${environment.API_URL}/auth/user`, { headers })
        .subscribe({
          next: ({ user }) => {
            this.authState.update(state => ({ ...state, user }));
          },
          error: () => {
            this.authState.update(state => ({ ...state, user: null }));
          },
        });
    }
  }

  login(credentials: LoginSchema): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.API_URL}/auth/login`, credentials)
      .pipe(
        tap(({ accessToken, user }) => {
          saveAccessToken(accessToken);

          this.authState.update(state => ({
            ...state,
            user,
          }));
        }),
        shareReplay()
      );
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }
}
