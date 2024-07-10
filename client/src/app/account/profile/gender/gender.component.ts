import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { genderValidator } from '@app/auth/signup/utils/validators';
import { HlmButtonDirective } from '@app/shared/ui/ui-button-helm/src';
import { ProfileService } from '../profile.service';
import { SelectComponent } from '@app/shared/ui/ui-select/ui-select.component';
import { SelectValueAccessorDirective } from '@app/shared/directives/selectValueAccessor.directive';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { catchError, tap, throwError } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-gender',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    HlmButtonDirective,
    SelectComponent,
    SelectValueAccessorDirective,
  ],
  providers: [ProfileService],
  templateUrl: './gender.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderComponent implements OnInit {
  genderForm!: FormGroup;
  genders = ['male', 'female', 'other'];
  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.genderForm = this.fb.group({
      gender: [this.genders[0], [Validators.required, genderValidator]],
    });
  }

  onSubmit(): void {
    const formData = {
      gender: this.genderForm.get('gender')?.value,
    };

    this.profileService.updateUser(formData)
      .pipe(
        tap(() => {
          toast.success('Gender updated successfully');
          this.genderForm.reset();
          this.router.navigate(['/account/profile']);
        }),
        catchError(error => {
          toast.error(error.error.message);
          return throwError(() => new Error('Failed to change gender'));
        })
      )
      .subscribe();
  }
}
