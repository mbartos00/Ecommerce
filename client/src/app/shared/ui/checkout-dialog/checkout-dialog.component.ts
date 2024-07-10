/* eslint-disable @typescript-eslint/member-ordering */
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
import { ProductInCart } from '@app/shared/types/product.model';
import { firstValueFrom } from 'rxjs';
import { Shipping } from '@app/shared/types/shipping';

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
  @Input() shippingMethod: Shipping | null = null;
  @Output() dialogClose = new EventEmitter<void>();

  paymentMethods = Object.keys(PaymentTypes) as PaymentTypeKey[];
  userPaymentMethods: PaymentMethod[] = [];
  addresses: Address[] = [];
  currentView: 'checkout' | 'payment' = 'checkout';
  isLoading = false;
  errorMessage: string | null = null;
  products: ProductInCart[] = [{}] as ProductInCart[];
  noPaymentMethodError: string | null = null;

  paymentIcons = {
    credit_card: '../../../../assets/buy.png',
    paypal: '../../../../assets/paypal_small.png',
    bank_transfer: '../../../../assets/bank.png',
  };

  private fb = inject(FormBuilder);
  private userService = inject(CheckoutService);

  ngOnInit(): void {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.products = JSON.parse(cart);
    }
    this.fetchPaymentMethods();
    this.fetchUserAddresses();
  }

  checkoutForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, nameValidator]],
    lastName: ['', [Validators.required, nameValidator]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, phoneValidator]],
    paymentMethod: ['', [Validators.required]],
    deliveryAddress: ['', [Validators.required]],
  });

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

  async fetchUserPaymentMethods(): Promise<void> {
    const selectedType = this.checkoutForm.get('paymentMethod')
      ?.value as PaymentTypeKey;
    try {
      this.userPaymentMethods = await firstValueFrom(
        this.userService.getUserPaymentMethodsByType(selectedType)
      );
      this.noPaymentMethodError =
        this.userPaymentMethods.length === 0
          ? `You don't have any ${PaymentTypes[selectedType]} payment methods. Please add one before proceeding.`
          : null;
    } catch (err) {
      console.error('Failed to load user payment methods', err);
      this.noPaymentMethodError =
        'Failed to load payment methods. Please try again.';
    }
  }

  selectAddress(address: Address): void {
    this.checkoutForm.patchValue({ deliveryAddress: address.id });
  }

  async selectPaymentMethod(method: PaymentTypeKey): Promise<void> {
    this.checkoutForm.patchValue({ paymentMethod: method });
  }

  selectPaymentOption(option: PaymentMethod): void {
    this.paymentOptionForm.patchValue({ paymentOption: option.id });
  }

  getPaymentMethodId(method: PaymentTypeKey): string {
    return method.toLowerCase().replace(/\s+/g, '-');
  }

  async onSubmit(): Promise<void> {
    if (this.checkoutForm.invalid) return;

    await this.fetchUserPaymentMethods();
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
  }

  private showFinalView(): void {
    this.sendDataToBackend();
  }

  private sendDataToBackend(): void {
    this.errorMessage = null;

    const checkoutData = this.checkoutForm.value;
    const paymentData = this.paymentOptionForm.value;

    const combinedData = {
      products: this.products,
      addressId: checkoutData.deliveryAddress!,
      paymentMethodId: paymentData.paymentOption!,
      shippingMethodId: this.shippingMethod!.id,
    };

    this.userService.submitCheckout(combinedData).subscribe({
      next: response => {
        console.log('Checkout successful', response);
        this.currentView = 'checkout';
        localStorage.removeItem('cart');
        this.isOpen = false;
      },
      error: error => {
        console.error('Checkout failed', error);
        this.isLoading = false;
        this.errorMessage = 'Checkout failed. Please try again.';
      },
    });
  }
}
