import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { phoneValidator } from '@app/auth/signup/utils/validators';
import { UserService } from '@app/shared/data-access/user.service';
import { PaymentTypesEnum } from '@app/shared/types/payments.model';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import {
  removeEmptyProperties,
  removeNullishProperties,
} from '@app/shared/utils/utils';
import { provideIcons } from '@ng-icons/core';
import { lucideMail, lucidePhone } from '@ng-icons/lucide';
import { toast } from 'ngx-sonner';
import { catchError, map, take, throwError } from 'rxjs';
import { PaymentsService } from '../../payments.service';

@Component({
  selector: 'app-paypal-update',
  templateUrl: './update-paypal.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmIconComponent,
    FormInputComponent,
    RouterModule,
  ],
  providers: [provideIcons({ lucidePhone, lucideMail })],
})
export class UpdatePaypalComponent implements OnInit {
  updatePaypalForm = new FormGroup({
    email: new FormControl(null, [Validators.email]),
    phoneNumber: new FormControl(null, {
      validators: [phoneValidator],
      updateOn: 'submit',
    }),
  });
  currentPaypalField!: string;
  private paymentsService = inject(PaymentsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.user$
      .pipe(
        take(2),
        map(
          data =>
            data.user?.paymentMethods
              .filter(paymentMethod => {
                return paymentMethod.id === this.route.snapshot.params['id'];
              })
              .map(d => removeNullishProperties(d))[0]
        )
      )
      .subscribe(d => {
        if (d?.email) {
          this.currentPaypalField = 'email';
        } else {
          this.currentPaypalField = 'phoneNumber';
        }
      });
  }

  removePaymentMethod(): void {
    const id = this.route.snapshot.params['id'];

    this.paymentsService.removePaymentMethod(id).subscribe(() => {
      this.router.navigate(['/account/payments/paypal']).then(() => {
        toast.success('Payment method deleted');
      });
    });
  }

  onSubmit(): void {
    if (
      Object.keys(removeEmptyProperties(this.updatePaypalForm.getRawValue()))
        .length === 0
    ) {
      toast.error('At least one field is required');
      this.updatePaypalForm.setErrors({ missingFields: true });
      return;
    }

    if (
      Object.values(removeEmptyProperties(this.updatePaypalForm.getRawValue()))
        .length === 2
    ) {
      toast.error('Pick either phone or email');
      this.updatePaypalForm.setErrors({ tooManyFields: true });
      return;
    }

    this.paymentsService
      .updatePaymentMethod({
        id: this.route.snapshot.params['id'],
        type: PaymentTypesEnum.paypal,
        ...removeEmptyProperties(this.updatePaypalForm.getRawValue()),
      })
      .pipe(
        catchError(err => {
          return throwError(() => err.message);
        })
      )
      .subscribe(() => {
        this.router.navigate(['/account/payments/paypal']).then(() => {
          toast.success('New payment method updated');
        });
      });
  }
}
