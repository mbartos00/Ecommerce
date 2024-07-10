import { CommonModule, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SelectValueAccessorDirective } from '@app/shared/directives/selectValueAccessor.directive';
import { SignupSchema } from '@app/shared/types/schemas';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import { LogoComponent } from '@app/shared/ui/logo/logo.component';
import { HlmButtonDirective } from '@app/shared/ui/ui-button-helm/src';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import { HlmInputDirective } from '@app/shared/ui/ui-input-helm/src';
import { SelectComponent } from '@app/shared/ui/ui-select/ui-select.component';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideFileImage,
  lucideLock,
  lucideMail,
  lucidePhone,
  lucideUser,
  lucideUserCircle,
} from '@ng-icons/lucide';
import { toast } from 'ngx-sonner';
import {
  avatarValidator,
  dateValidator,
  genderValidator,
  nameValidator,
  passwordMatchesValidator,
  passwordValidator,
  phoneValidator,
} from '../utils/validators';
import { Gender } from '@app/shared/types/user';

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
    SelectComponent,
    SelectValueAccessorDirective,
  ],
  providers: [
    provideIcons({
      lucideMail,
      lucideUser,
      lucideLock,
      lucidePhone,
      lucideCalendar,
      lucideFileImage,
      lucideUserCircle,
    }),
  ],
  templateUrl: './signup-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupFormComponent implements OnInit {
  @Output() createUser = new EventEmitter<SignupSchema>();
  signup = false;
  passwordMismatch = false;
  signupForm!: FormGroup;
  genders: Gender[] = ['male', 'female', 'other'];
  birthdayDateRange: [string, string] = [
    '1920-01-01',
    formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
  ];
  private router = inject(Router);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, nameValidator]],
        lastName: ['', [Validators.required, nameValidator]],
        email: ['', [Validators.email, Validators.required]],
        phone_number: ['', [Validators.required, phoneValidator]],
        birthday: ['', [Validators.required, dateValidator]],
        gender: [this.genders[0], [Validators.required, genderValidator]],
        avatar: [null, avatarValidator],
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

  onFileSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files![0];
    if (file) {
      this.signupForm.patchValue({
        avatarImage: file,
      });
    }
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    this.createUser.emit(this.signupForm.getRawValue());
    this.signupForm.reset();
    this.router.navigate(['auth/login']).then(() => {
      toast.success('The account has been created, you can log in');
    });
  }
}
