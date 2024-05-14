import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, switchMap } from 'rxjs';
import { AuthService } from '@app/shared/data-access/auth.service';
import { SignupSchema } from '../../../shared/types/schemas';
import { hasMessageProperty } from '../../../shared/utils/type-guards';

export type SignupStatus = 'pending' | 'creating' | 'success' | 'error';

interface SignupState {
  status: SignupStatus;
}

@Injectable()
export class SignupService {
  status = computed(() => this.state().status);

  error$ = new Subject<string>();
  createUser$ = new Subject<SignupSchema>();

  userCreated$ = this.createUser$.pipe(
    switchMap(credentials => {
      return this.authService.createAccount(credentials).pipe(
        catchError((err: unknown) => {
          if (hasMessageProperty(err)) {
            this.error$.next(err.message);
          } else {
            this.error$.next('Something went wrong');
          }
          return EMPTY;
        })
      );
    })
  );

  private authService = inject(AuthService);
  private state = signal<SignupState>({
    status: 'pending',
  });

  constructor() {
    this.userCreated$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update(state => ({ ...state, status: 'success' }))
      );

    this.createUser$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update(state => ({ ...state, status: 'creating' }))
      );

    this.error$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update(state => ({ ...state, status: 'error' }))
      );
  }
}
