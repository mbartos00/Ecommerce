import {
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { getAccessToken } from '../utils/tokens';
import { inject } from '@angular/core';
import { AuthService } from '../data-access/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const jwtHelper = new JwtHelperService();
  const accessToken = getAccessToken();

  let authReq = req;

  if (req.url.includes('/login')) {
    return next(req);
  }

  if (accessToken && !jwtHelper.isTokenExpired(accessToken)) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 403 &&
        accessToken &&
        jwtHelper.isTokenExpired(accessToken)
      ) {
        return authService.refreshToken().pipe(
          switchMap(({ accessToken }) => {
            const newAuthReq = req.clone({
              setHeaders: { Authorization: `Bearer ${accessToken}` },
            });

            return next(newAuthReq);
          }),
          catchError(err => {
            authService.logout();
            return throwError(() => new Error(err));
          })
        );
      }
      return throwError(() => new Error(error.message));
    })
  );
};
