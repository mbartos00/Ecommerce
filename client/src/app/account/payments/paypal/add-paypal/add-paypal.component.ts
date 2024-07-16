import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { phoneValidator } from '@app/auth/signup/utils/validators';
import { PaymentTypesEnum } from '@app/shared/types/payments.model';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import { removeEmptyProperties } from '@app/shared/utils/utils';
import { provideIcons } from '@ng-icons/core';
import { lucideMail, lucidePhone } from '@ng-icons/lucide';
import { toast } from 'ngx-sonner';
import { PaymentsService } from '../../payments.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-paypal-add',
  templateUrl: './add-paypal.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, HlmIconComponent, FormInputComponent],
  providers: [provideIcons({ lucidePhone, lucideMail })],
})
export class AddPaypalComponent {
  addPaypalForm = new FormGroup({
    email: new FormControl(null, [Validators.email]),
    phoneNumber: new FormControl(null, {
      validators: [phoneValidator],
      updateOn: 'change',
    }),
  });
  private paymentsService = inject(PaymentsService);
  private router = inject(Router);

  onSubmit(): void {
    if (
      Object.keys(removeEmptyProperties(this.addPaypalForm.getRawValue()))
        .length === 0
    ) {
      toast.error('At least one field is required');
      this.addPaypalForm.setErrors({ missingFields: true });
      return;
    }

    if (
      Object.values(removeEmptyProperties(this.addPaypalForm.getRawValue()))
        .length === 2
    ) {
      toast.error('Pick either phone or email');
      this.addPaypalForm.setErrors({ tooManyFields: true });
      return;
    }

    if (this.addPaypalForm.invalid) {
      return;
    }

    this.paymentsService
      .addPaymentMethod({
        type: PaymentTypesEnum.paypal,
        ...removeEmptyProperties(this.addPaypalForm.getRawValue()),
      })
      .pipe(
        catchError(err => {
          toast.error(err.message);
          return throwError(() => err.message);
        })
      )
      .subscribe(() => {
        this.router.navigate(['/account/payments/paypal']).then(() => {
          toast.success('New payment method added');
        });
      });
  }
}
