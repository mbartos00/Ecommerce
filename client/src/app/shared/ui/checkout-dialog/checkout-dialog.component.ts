import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  nameValidator,
  phoneValidator,
} from '@app/auth/signup/utils/validators';
import { FormInputComponent } from '../form-input/form-input.component';
import { lucideCheck, lucideChevronLeft } from '@ng-icons/lucide';
import { provideIcons } from '@ng-icons/core';
import { HlmIconComponent } from '../ui-icon-helm/src';
import { Address } from '@app/shared/types/address';

import {
  PaymentMethod,
  PaymentTypeKey,
  PaymentTypes,
} from '@app/shared/types/payment';
import { CheckoutService } from '@app/shared/data-access/checkout.service';
import { CommonModule } from '@angular/common';
import { PaymentTypePipe } from '@app/shared/utils/payment-type.pipe';

@Component({
  selector: 'app-checkout-dialog',
  standalone: true,
  templateUrl: './checkout-dialog.component.html',
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    HlmIconComponent,
    CommonModule,
    PaymentTypePipe,
  ],
  providers: [provideIcons({ lucideChevronLeft, lucideCheck })],
})
export class CheckoutDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() dialogClose = new EventEmitter<void>();

  paymentMethods = Object.keys(PaymentTypes) as PaymentTypeKey[];
  userPaymentMethods: PaymentMethod[] = [];
  addresses: Address[] = [];
  currentView: 'checkout' | 'payment' | 'final' = 'checkout';
  isLoading = false;
  errorMessage: string | null = null;

  paymentIcons = {
    credit_card: '../../../../assets/buy.png',
    paypal: '../../../../assets/paypal_small.png',
    bank_transfer: '../../../../assets/bank.png',
  };

  private fb = inject(FormBuilder);
  private userService = inject(CheckoutService);

  ngOnInit(): void {
    this.fetchPaymentMethods();
    this.fetchUserAddresses();
  }

  //eslint-disable-next-line
  checkoutForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, nameValidator]],
    lastName: ['', [Validators.required, nameValidator]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, phoneValidator]],
    paymentMethod: ['', [Validators.required]],
    deliveryAddress: ['', [Validators.required]],
  });

  //eslint-disable-next-line
  paymentOptionForm = this.fb.group({
    paymentOption: ['', Validators.required],
  });

  fetchPaymentMethods(): void {
    this.userService.getPaymentMethods().subscribe({
      next: methods => (this.userPaymentMethods = methods),
      error: err => console.error('Failed to load payment methods', err),
    });
  }

  fetchUserAddresses(): void {
    this.userService.getUserAddresses().subscribe({
      next: addresses => (this.addresses = addresses),
      error: err => console.error('Failed to load user addresses', err),
    });
  }

  fetchUserPaymentMethods(): void {
    const selectedType = this.checkoutForm.get('paymentMethod')
      ?.value as PaymentTypeKey;
    this.userService.getUserPaymentMethodsByType(selectedType).subscribe({
      next: methods => (this.userPaymentMethods = methods),
      error: err => console.error('Failed to load user payment methods', err),
    });
  }

  selectAddress(address: Address): void {
    this.checkoutForm.patchValue({ deliveryAddress: address.id });
  }

  selectPaymentMethod(method: PaymentTypeKey): void {
    this.checkoutForm.patchValue({ paymentMethod: method });
  }

  selectPaymentOption(option: PaymentMethod): void {
    this.paymentOptionForm.patchValue({ paymentOption: option.id });
  }

  getPaymentMethodId(method: PaymentTypeKey): string {
    return method.toLowerCase().replace(/\s+/g, '-');
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) return;

    this.showPaymentMethods();
  }

  onProceedPayment(): void {
    if (this.paymentOptionForm.invalid) return;

    this.showFinalView();
  }

  goBack(): void {
    if (this.currentView === 'checkout') {
      this.closeDialog();
    } else {
      this.currentView = 'checkout';
    }
  }

  closeDialog(): void {
    this.isOpen = false;
    this.dialogClose.emit();
  }

  showPaymentMethods(): void {
    this.currentView = 'payment';
    this.fetchUserPaymentMethods();
  }

  private showFinalView(): void {
    this.sendDataToBackend();
  }

  // TODO adjust data type to properly send to backend
  private sendDataToBackend(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const checkoutData = this.checkoutForm.value;
    const paymentData = this.paymentOptionForm.value;

    const combinedData = {
      ...checkoutData,
      ...paymentData,
    };

    this.userService.submitCheckout(combinedData).subscribe({
      next: response => {
        console.log('Checkout successful', response);
        this.isLoading = false;
        localStorage.removeItem('cart');
        this.currentView = 'final';
      },
      error: error => {
        console.error('Checkout failed', error);
        this.isLoading = false;
        this.errorMessage = 'Checkout failed. Please try again.';
      },
    });
  }
}
