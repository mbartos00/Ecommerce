import {
  Component,
  effect,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SignupFormComponent } from './ui/signup-form.component';
import { SignupService } from './data-access/signup.service';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/data-access/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  template: `<app-signup-form
    (createUser)="signupService.createUser$.next($event)"
  >
  </app-signup-form>`,
  providers: [SignupService],
  imports: [SignupFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  public signupService = inject(SignupService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate(['home']);
      }
    });
  }
}
