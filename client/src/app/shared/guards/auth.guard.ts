import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { UserService } from '../data-access/user.service';

export const AuthGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.user$.pipe(
    take(1),
    map(({ isAuth }) => {
      if (isAuth) {
        return true;
      }

      return router.createUrlTree(['/auth']);
    })
  );
};
