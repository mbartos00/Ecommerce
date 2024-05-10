import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { credentialsInterceptor } from './shared/interceptors/credentials.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { getAccessToken } from './shared/utils/tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          allowedDomains: ['localhost:8080'],
          tokenGetter: getAccessToken,
        },
      })
    ),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
  ],
};
