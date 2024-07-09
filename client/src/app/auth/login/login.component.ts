import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoginService } from './data-access/login.service';
import { LoginFormComponent } from './ui/login-form/login-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent, CommonModule],
  template: `<app-login-form
    [loginStatus]="loginService.status()"
    (login)="loginService.login$.next($event)"
    [message]="(loginService.error$ | async) ?? undefined"
  >
  </app-login-form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoginService],
})
export class LoginComponent {
  loginService = inject(LoginService);
}
