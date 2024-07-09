import { APP_INITIALIZER, Provider } from '@angular/core';
import { UserService } from './shared/data-access/user.service';

export function initializeUserFactory(userService: UserService) {
  return (): void => userService.initializeUser();
}

export const appInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeUserFactory,
  deps: [UserService],
  multi: true,
};
