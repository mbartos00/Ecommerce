import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { ProfileService } from '../profile.service';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import { dateValidator } from '@app/auth/signup/utils/validators';
import { HlmButtonDirective } from '@app/shared/ui/ui-button-helm/src';
import { toast } from 'ngx-sonner';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-birthday',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    HlmButtonDirective,
  ],
  providers: [ProfileService],
  templateUrl: './birthday.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayComponent implements OnInit {
  birthdayForm!: FormGroup;
  birthdayDateRange: [string, string] = [
    '1920-01-01',
    formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
  ];
  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.birthdayForm = this.fb.group({
      birthday: ['', [Validators.required, dateValidator]],
    });
  }

  onSubmit(): void {
    const formData = {
      birthday: new Date(this.birthdayForm.get('birthday')?.value),
    };

    this.profileService.updateUser(formData)
      .pipe(
        tap(() => {
          toast.success('birthday updated successfully');
          this.birthdayForm.reset();
          this.router.navigate(['/account/profile']);
        }),
        catchError(error => {
          toast.error(error.error.message);
          return throwError(() => new Error('Failed to change birthday'));
        })
      )
      .subscribe();
  }
}
