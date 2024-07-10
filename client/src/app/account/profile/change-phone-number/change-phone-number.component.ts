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
import { Router, RouterModule } from '@angular/router';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import { HlmLabelDirective } from '@app/shared/ui/ui-label-helm/src';
import { provideIcons } from '@ng-icons/core';
import { lucidePhone } from '@ng-icons/lucide';
import { ProfileService } from '../profile.service';
import { toast } from 'ngx-sonner';
import { HlmSpinnerComponent } from '@app/shared/ui/ui-spinner-helm/src';
import { BehaviorSubject, EMPTY, catchError, map, switchMap, tap } from 'rxjs';
import { UserService } from '@app/shared/data-access/user.service';

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
      lucidePhone,
    }),
  ],
  templateUrl: './change-phone-number.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePhoneNumberComponent implements OnInit {
  private refreshSubject = new BehaviorSubject<void>(undefined);

  phoneNumber$ = this.refreshSubject.pipe(
    switchMap(() => this.userService.user$),
    map(userData => userData.user!.phone_number)
  );

  changePhoneNumberForm = new FormGroup({
    phoneNumber: new FormControl('', {
      validators: [
        Validators.pattern(/^\(?\d{3}\)?[- .]?\d{3}[- .]?\d{3}$/),
        Validators.required,
      ],
      updateOn: 'blur',
    }),
  });

  private router = inject(Router);

  constructor(
    private profileService: ProfileService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.phoneNumber$
      .pipe(
        tap(phoneNumber => {
          this.changePhoneNumberForm.patchValue(
            { phoneNumber },
            { emitEvent: false }
          );
        })
      )
      .subscribe();
  }

  onSubmit(): void {
    if (this.changePhoneNumberForm.invalid) {
      return;
    }

    const newPhoneNumber = this.changePhoneNumberForm.get('phoneNumber')?.value;

    if (newPhoneNumber) {
      this.profileService
        .updateUser({ phone_number: newPhoneNumber })
        .pipe(
          tap(() => {
            toast.success('Phone number changed');
            this.router.navigate(['/account/profile']);
          }),
          catchError(error => {
            console.error(error);
            toast.error('Failed to change phone number');
            return EMPTY;
          })
        )
        .subscribe();
    }
  }
}
