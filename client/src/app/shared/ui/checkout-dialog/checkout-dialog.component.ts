/* eslint-disable @typescript-eslint/member-ordering */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import { toast } from 'ngx-sonner';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() shippingMethod: Shipping | null = null;
  @Output() dialogClose = new EventEmitter<void>();

  paymentMethods = Object.keys(PaymentTypes) as PaymentTypeKey[];
  userPaymentMethods: PaymentMethod[] = [];
  addresses: Address[] = [];
  currentView: 'checkout' | 'payment' | 'final' = 'checkout';
  message: string | null = null;
  products: ProductInCart[] = [{}] as ProductInCart[];
  noPaymentMethodError: string | null = null;

  paymentIcons = {
    credit_card: '../../../../assets/buy.png',
    paypal: '../../../../assets/paypal_small.png',
    bank_transfer: '../../../../assets/bank.png',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private userService: CheckoutService
  ) {}

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
    await this.fetchUserPaymentMethods();
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
  }

  private async finalizeCheckout(): Promise<void> {
    await this.sendDataToBackend();
  }

  private showFinalView(): void {
    this.message = 'Finalization of Order';
    this.currentView = 'final';
    this.finalizeCheckout();
  }

  private async sendDataToBackend(): Promise<void> {
    const checkoutData = this.checkoutForm.value;
    const paymentData = this.paymentOptionForm.value;

    const combinedData = {
      products: this.products,
      addressId: checkoutData.deliveryAddress!,
      paymentMethodId: paymentData.paymentOption!,
      shippingMethodId: this.shippingMethod!.id,
    };

    this.userService.submitCheckout(combinedData).subscribe({
      next: () => {
        this.message = 'Checkout Success!';
        this.cdr.detectChanges();
        localStorage.removeItem('cart');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: error => {
        console.error('Checkout failed', error);
        toast.error('Checkout failed. Please try again.');
        this.message = 'Checkout failed. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }
}
