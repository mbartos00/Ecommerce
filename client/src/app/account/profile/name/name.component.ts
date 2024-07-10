import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../profile.service';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import { nameValidator } from '@app/auth/signup/utils/validators';
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
  selector: 'app-name',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    HlmButtonDirective,
  ],
  providers: [ProfileService],
  templateUrl: './name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameComponent implements OnInit {
  nameForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nameForm = this.fb.group({
      name: ['', [Validators.required, nameValidator]],
      lastName: ['', [Validators.required, nameValidator]],
    });
  }

  onSubmit(): void {
    if (this.nameForm.valid) {
      const formData = {
        name: this.nameForm.get('name')?.value,
        lastName: this.nameForm.get('lastName')?.value,
      };

      this.profileService.updateUser(formData)
        .pipe(
          tap(() => {
            toast.success('Name updated successfully');
            this.nameForm.reset();
            this.router.navigate(['/account/profile']);
          }),
          catchError(error => {
            toast.error(error.error.message);
            return throwError(() => new Error('Failed to change name'));
          })
        )
        .subscribe();
    }
  }
}
