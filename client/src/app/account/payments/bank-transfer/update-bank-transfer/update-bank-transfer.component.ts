import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentTypesEnum } from '@app/shared/types/payments.model';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import { provideIcons } from '@ng-icons/core';
import { toast } from 'ngx-sonner';
import { catchError, throwError } from 'rxjs';
import { PaymentsService } from '../../payments.service';
import {
  lucideCreditCard,
  lucideHome,
  lucideLandmark,
  lucideUser2,
} from '@ng-icons/lucide';
import {
  accountNumberValidator,
  zipCodeValidator,
} from '@app/auth/signup/utils/validators';
import { removeEmptyProperties } from '@app/shared/utils/utils';

@Component({
  selector: 'app-bank-transfer-update',
  templateUrl: './update-bank-transfer.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, HlmIconComponent, FormInputComponent],
  providers: [
    provideIcons({ lucideHome, lucideUser2, lucideCreditCard, lucideLandmark }),
  ],
})
export class UpdateBankTransferComponent {
  updateBankTransferForm = new FormGroup({
    firstName: new FormControl(null),
    lastName: new FormControl(null),
    accountNumber: new FormControl(null, [accountNumberValidator]),
    bankName: new FormControl(null),
    city: new FormControl(''),
    street: new FormControl(''),
    zipCode: new FormControl('', [zipCodeValidator]),
  });
  private paymentsService = inject(PaymentsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  removePaymentMethod(): void {
    const id = this.route.snapshot.params['id'];

    this.paymentsService.removePaymentMethod(id).subscribe(() => {
      this.router.navigate(['/account/payments/bank-transfer']).then(() => {
        toast.success('Payment method deleted');
      });
    });
  }

  onSubmit(): void {
    const formData = this.updateBankTransferForm.getRawValue();
    if (Object.keys(removeEmptyProperties(formData)).length === 0) {
      toast.error('At least one field is required');
      this.updateBankTransferForm.setErrors({ missingFields: true });
      return;
    }

    const { street, city, zipCode, ...rest } = formData;

    const addressFields = [street, city, zipCode];
    const addressFieldsPresent = addressFields.some(
      field => field !== null && field !== undefined && field !== ''
    );

    if (
      addressFieldsPresent &&
      addressFields.some(
        field => field === null || field === undefined || field === ''
      )
    ) {
      toast.error('Please provide all of address fields');
      this.updateBankTransferForm.setErrors({ addressIncomplete: true });
      return;
    }

    const address =
      street &&
      `${street}, ${city}, ${zipCode?.substring(0, 2)}-${zipCode?.substring(2, zipCode?.length)}`;

    const dataToSend = removeEmptyProperties({ ...rest, address });

    this.paymentsService
      .updatePaymentMethod({
        id: this.route.snapshot.params['id'],
        type: PaymentTypesEnum.bank_transfer,
        ...dataToSend,
      })
      .pipe(
        catchError(err => {
          return throwError(() => err.message);
        })
      )
      .subscribe(() => {
        this.router.navigate(['/account/payments/bank-transfer']).then(() => {
          toast.success('New payment method updated');
        });
      });
  }
}
