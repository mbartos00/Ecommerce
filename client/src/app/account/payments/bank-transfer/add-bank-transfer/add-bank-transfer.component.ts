import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-bank-transfer-add',
  templateUrl: './add-bank-transfer.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, HlmIconComponent, FormInputComponent],
  providers: [
    provideIcons({ lucideHome, lucideUser2, lucideCreditCard, lucideLandmark }),
  ],
})
export class AddBankTransferComponent {
  addBankTransferForm = new FormGroup({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    accountNumber: new FormControl(null, [
      Validators.required,
      accountNumberValidator,
    ]),
    bankName: new FormControl(null, [Validators.required]),
    city: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required, zipCodeValidator]),
  });
  private paymentsService = inject(PaymentsService);
  private router = inject(Router);

  onSubmit(): void {
    if (this.addBankTransferForm.invalid) {
      return;
    }
    const { street, city, zipCode, ...rest } =
      this.addBankTransferForm.getRawValue();
    const address = `${street}, ${city}, ${zipCode!.substring(0, 2)}-${zipCode!.substring(2, zipCode?.length)}`;

    this.paymentsService
      .addPaymentMethod({
        type: PaymentTypesEnum.bank_transfer,
        ...rest,
        address,
      })
      .pipe(
        catchError(err => {
          toast.error(err.message);
          return throwError(() => err.message);
        })
      )
      .subscribe(() => {
        this.router.navigate(['/account/payments/bank-transfer']).then(() => {
          toast.success('New payment method added');
        });
      });
  }
}
