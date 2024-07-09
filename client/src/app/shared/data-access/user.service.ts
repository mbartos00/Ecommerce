import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../types/user';
import { getAccessToken } from '../utils/tokens';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';

type UserResponse = {
  status: string;
  data: User | null;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<{
    isAuth: boolean;
    user: User | null;
  }>({
    isAuth: false,
    user: null,
  });
  private http = inject(HttpClient);
  //eslint-disable-next-line
  user$ = this.userSubject.asObservable();

  updateUserState(isAuthenticated: boolean, user: User | null): void {
    this.userSubject.next({ isAuth: isAuthenticated, user });
  }

  initializeUser(): void {
    const token = getAccessToken();
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .get<UserResponse>(`${environment.API_URL}/user`, { headers })
        .subscribe({
          next: user => {
            this.updateUserState(true, user.data);
          },
          error: () => {
            this.updateUserState(false, null);
          },
        });
    }
  }
}