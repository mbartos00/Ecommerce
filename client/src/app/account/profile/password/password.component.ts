import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../profile.service';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import {
  passwordValidator,
  passwordMatchesValidator,
} from '@app/auth/signup/utils/validators';
import { HlmButtonDirective } from '@app/shared/ui/ui-button-helm/src';
import { toast } from 'ngx-sonner';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideLock } from '@ng-icons/lucide';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    HlmButtonDirective,
    HlmIconComponent,
  ],
  providers: [
    ProfileService,
    provideIcons({
      lucideLock,
    }),
  ],
  templateUrl: './password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  passwordMismatch = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.passwordForm = this.fb.group(
      {
        oldPassword: [
          '',
          [Validators.minLength(8), Validators.required, passwordValidator],
        ],
        newPassword: [
          '',
          [Validators.minLength(8), Validators.required, passwordValidator],
        ],
        confirmPassword: ['', [Validators.minLength(8), Validators.required]],
      },
      {
        validators: [passwordMatchesValidator],
        updateOn: 'blur',
      }
    );

    this.passwordForm.valueChanges.subscribe(() => {
      this.passwordMismatch = this.passwordForm.hasError('passwordMismatch');
    });
  }

  onSubmit(): void {
    const formData = {
      oldPassword: this.passwordForm.get('oldPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value,
      repeatPassword: this.passwordForm.get('confirmPassword')?.value,
    };

    this.profileService.updateUser(formData)
      .pipe(
        tap(() => {
          toast.success('password updated successfully');
          this.passwordForm.reset();
          this.router.navigate(['/account/profile']);
        }),
        catchError(error => {
          toast.error(error.error.message);
          return throwError(() => new Error('Failed to change password'));
        })
      )
      .subscribe();
  }
}
