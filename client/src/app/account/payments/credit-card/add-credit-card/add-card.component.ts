import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  creditCardValidator,
  expirationDateValidator,
  securityCodeValidator,
} from '@app/auth/signup/utils/validators';
import { PaymentTypesEnum } from '@app/shared/types/payments.model';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideCreditCard,
  lucideLock,
  lucideUser2,
} from '@ng-icons/lucide';
import { PaymentsService } from '../../payments.service';
import { catchError, throwError } from 'rxjs';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-credit-card-add',
  templateUrl: './add-card.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, HlmIconComponent, FormInputComponent],
  providers: [
    provideIcons({ lucideCreditCard, lucideCalendar, lucideLock, lucideUser2 }),
  ],
})
export class AddCreditCardComponent {
  addCardForm = new FormGroup({
    cardNumber: new FormControl(null, [
      Validators.required,
      creditCardValidator,
    ]),
    expirationDate: new FormControl(null, [
      Validators.required,
      expirationDateValidator,
    ]),
    securityCode: new FormControl(null, [
      Validators.required,
      securityCodeValidator,
    ]),
    cardHolder: new FormControl(null, [Validators.required]),
  });
  private paymentsService = inject(PaymentsService);
  private router = inject(Router);

  onSubmit(): void {
    this.paymentsService
      .addPaymentMethod({
        type: PaymentTypesEnum.credit_card,
        ...this.addCardForm.getRawValue(),
      })
      .pipe(
        catchError(err => {
          toast.error(err.message);
          return throwError(() => err.message);
        })
      )
      .subscribe(() => {
        this.router.navigate(['/account/payments/credit-card']).then(() => {
          toast.success('New payment method added');
        });
      });
  }
}
