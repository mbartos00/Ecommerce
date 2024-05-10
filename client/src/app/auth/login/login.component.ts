import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { LoginService } from './data-access/login.service';
import { AuthService } from '@app/shared/data-access/auth.service';
import { Router } from '@angular/router';
import { LoginFormComponent } from './ui/login-form/login-form.component';
import { CommonModule } from '@angular/common';

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
  styles: `
    :host {
      @apply min-h-screen flex justify-center items-center;
    }
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginService = inject(LoginService);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate(['']);
      }
    });
  }
}
