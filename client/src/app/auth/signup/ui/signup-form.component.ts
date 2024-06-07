import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@app/shared/ui/ui-button-helm/src';
import { HlmInputDirective } from '@app/shared/ui/ui-input-helm/src';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import { provideIcons } from '@ng-icons/core';
import { lucideMail, lucideUser, lucideLock } from '@ng-icons/lucide';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import {
  passwordMatchesValidator,
  nameValidator,
  passwordValidator,
} from '../utils/validators';
import { SignupSchema } from '@app/shared/types/schemas';
import { LogoComponent } from '@app/shared/ui/logo/logo.component';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmInputDirective,
    HlmIconComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    LogoComponent,
    FormInputComponent,
  ],
  providers: [provideIcons({ lucideMail, lucideUser, lucideLock })],
  templateUrl: './signup-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupFormComponent implements OnInit {
  @Output() createUser = new EventEmitter<SignupSchema>();
  signup = false;
  passwordMismatch = false;
  signupForm!: FormGroup;
  private router = inject(Router);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, nameValidator]],
        lastName: ['', [Validators.required, nameValidator]],
        email: ['', [Validators.email, Validators.required]],
        password: [
          '',
          [Validators.minLength(8), Validators.required, passwordValidator],
        ],
        confirmPassword: ['', [Validators.minLength(8), Validators.required]],
      },
      {
        validators: [passwordMatchesValidator],
      }
    );
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;
    this.createUser.emit(this.signupForm.getRawValue());
    this.signupForm.reset();
    this.router.navigate(['/login']).then(() => {
      toast.success('The account has been created, you can log in');
    });
  }
}
