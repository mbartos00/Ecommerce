import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  creditCardValidator,
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
import { removeEmptyProperties } from '@app/shared/utils/utils';

@Component({
  selector: 'app-credit-card-update',
  templateUrl: './update-card.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, HlmIconComponent, FormInputComponent],
  providers: [
    provideIcons({ lucideCreditCard, lucideCalendar, lucideLock, lucideUser2 }),
  ],
})
export class UpdateCreditCardComponent {
  updateCardForm = new FormGroup({
    cardNumber: new FormControl(null, [creditCardValidator]),
    securityCode: new FormControl(null, [securityCodeValidator]),
    cardHolder: new FormControl(null),
  });
  private paymentsService = inject(PaymentsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  removePaymentMethod(): void {
    const id = this.route.snapshot.params['id'];

    this.paymentsService.removePaymentMethod(id).subscribe(() => {
      this.router.navigate(['/account/payments/credit-card']).then(() => {
        toast.success('Payment method deleted');
      });
    });
  }

  onSubmit(): void {
    if (
      Object.keys(removeEmptyProperties(this.updateCardForm.getRawValue()))
        .length === 0
    ) {
      toast.error('At least one field is required');
      this.updateCardForm.setErrors({ missingFields: true });
      return;
    }

    this.paymentsService
      .updatePaymentMethod({
        id: this.route.snapshot.params['id'],
        type: PaymentTypesEnum.credit_card,
        ...removeEmptyProperties(this.updateCardForm.getRawValue()),
      })
      .pipe(
        catchError(err => {
          return throwError(() => err.message);
        })
      )
      .subscribe(() => {
        this.router.navigate(['/account/payments/credit-card']).then(() => {
          toast.success('New payment method updated');
        });
      });
  }
}
