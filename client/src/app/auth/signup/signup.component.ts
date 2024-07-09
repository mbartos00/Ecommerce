import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SignupService } from './data-access/signup.service';
import { SignupFormComponent } from './ui/signup-form.component';

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
}
