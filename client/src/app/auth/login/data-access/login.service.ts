import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@shared/data-access/auth.service';
import { LoginSchema } from '@shared/types/schemas';
import { hasMessageProperty } from '@shared/utils/type-guards';
import { EMPTY, Subject, catchError, switchMap } from 'rxjs';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';
export type LoginState = {
  status: LoginStatus;
};

@Injectable()
export class LoginService {
  private authService = inject(AuthService);
  private loginState = signal<LoginState>({
    status: 'pending',
  });

  status = computed(() => this.loginState().status);

  error$ = new Subject<string>();
  login$ = new Subject<LoginSchema>();

  userAuthenticated$ = this.login$.pipe(
    switchMap(credentials => {
      return this.authService.login(credentials).pipe(
        catchError((err: HttpErrorResponse) => {
          if (hasMessageProperty(err.error)) {
            this.error$.next(err.error.message);
          } else {
            this.error$.next('Something went wrong');
          }

          return EMPTY;
        })
      );
    })
  );

  constructor() {
    this.userAuthenticated$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.loginState.update(state => ({
        ...state,
        status: 'success',
      }));
    });

    this.login$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.loginState.update(state => ({
        ...state,
        status: 'authenticating',
      }));
    });

    this.error$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.loginState.update(state => ({
        ...state,
        status: 'error',
      }));
    });
  }
}
