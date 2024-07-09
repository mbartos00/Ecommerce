import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import { HlmLabelDirective } from '@app/shared/ui/ui-label-helm/src';
import { provideIcons } from '@ng-icons/core';
import { lucideMail } from '@ng-icons/lucide';
import { ProfileService } from '../profile.service';
import { catchError, take, tap, throwError } from 'rxjs';
import { toast } from 'ngx-sonner';
import { HlmSpinnerComponent } from '@app/shared/ui/ui-spinner-helm/src';
import { AuthService } from '@app/shared/data-access/auth.service';

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HlmIconComponent,
    ReactiveFormsModule,
    FormInputComponent,
    HlmLabelDirective,
    HlmSpinnerComponent,
  ],
  providers: [
    provideIcons({
      lucideMail,
    }),
  ],
  templateUrl: './change-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeEmailComponent implements OnInit {
  changeEmailForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      updateOn: 'blur',
    }),
  });
  isLoading = false;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.profileService
          .verifyEmail(params['token'])
          .pipe(
            tap(() => (this.isLoading = true)),
            catchError(error => {
              toast.error(error.error.message);
              return throwError(() => new Error('Failed to send message'));
            })
          )
          .subscribe(d => {
            this.profileService
              .updateUser({ email: d.email })
              .pipe(
                take(1),
                catchError(error => {
                  toast.error(error.error.message);
                  return throwError(() => new Error('Failed to send message'));
                })
              )
              .subscribe(() => {
                this.authService
                  .logout()
                  .pipe(take(1))
                  .subscribe(() => {
                    this.router.navigate(['/']).then(() => {
                      toast.success('Email updated', {
                        description: 'Please log in again',
                      });
                    });
                  });
                this.isLoading = false;
              });
          });
      }
    });
  }

  onSubmit(): void {
    if (this.changeEmailForm.invalid) {
      return;
    }

    this.profileService
      .changeEmail(this.changeEmailForm.getRawValue().email!)
      .pipe(take(1))
      .subscribe(() => {
        this.changeEmailForm.reset();
        toast.success('Email sent');
      });
  }
}
