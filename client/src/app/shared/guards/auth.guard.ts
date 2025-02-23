import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, of, switchMap, take } from 'rxjs';
import { UserService } from '../data-access/user.service';

export const AuthGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.user$.pipe(
    take(1),
    switchMap(userState => {
      if (userState.isAuth) {
        return of(true);
      }

      // Ensure user initialization is complete before making a decision
      userService.initializeUser();
      return userService.user$.pipe(
        take(1), // Wait for update
        switchMap(updatedState => {
          if (updatedState.isAuth) {
            return of(true);
          }
          return of(router.createUrlTree(['/auth']));
        })
      );
    })
  );
};
