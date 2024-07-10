import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { Observable, map } from 'rxjs';
import { UserService } from '../data-access/user.service';
import { Discount } from '../types/discount';
<<<<<<< HEAD
import { CheckoutDialogComponent } from '../ui/checkout-dialog/checkout-dialog.component';
import { AvailabilityData } from '../types/product.model';
import { ResponseFormat } from '../types/response';
import { toast } from 'ngx-sonner';
=======
import { ProductInCart } from '../types/product.model';
import { CounterInputComponent } from '../ui/counter-input/counter-input.component';
import { CartService } from './cart.service';
import { Shipping } from '../types/shipping';
import { RadioComponent } from '../ui/radio-button/radio.component';
import { HlmButtonDirective } from '../ui/ui-button-helm/src';
>>>>>>> origin/develop

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  providers: [provideIcons({ lucideX })],
  imports: [
    HlmIconComponent,
    CommonModule,
    CounterInputComponent,
<<<<<<< HEAD
    CheckoutDialogComponent,
    FormsModule,
  ],
=======
    FormsModule,
    RadioComponent,
    HlmButtonDirective,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
>>>>>>> origin/develop
})
export class CartComponent implements OnInit {
  productsInCart$: Observable<ProductInCart[]> = this.cartService.cart$;
  subtotal$: Observable<number> = this.cartService.getSubtotal();
<<<<<<< HEAD
  isCheckoutDialogOpen = false;
  cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
=======
  shippingOptions$: Observable<Shipping[]> = new Observable<Shipping[]>();
  selectedShippingOption: Shipping | null = null;
  isAuthenticated$!: Observable<boolean>;
>>>>>>> origin/develop
  discount: Discount = {
    code: '',
    discount_amount: 0,
    discount_type: '',
    message: '',
  };

  constructor(
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.shippingOptions$ = this.cartService.getShippingOptions();
    this.isAuthenticated$ = this.userService.user$.pipe(map(d => d.isAuth));
  }

  formatCartData(cartItems: ProductInCart[]): AvailabilityData[] {
    return cartItems.map(item => ({
      productId: item.id,
      variantId: item.variantId,
      quantityToBuy: item.quantityToBuy,
    }));
  }

  onDeleteProductFromCart(product: ProductInCart): void {
    this.cartService.removeProductFromCart(product);
  }

  onQuantityChange(product: ProductInCart, quantity: number): void {
    this.cartService.updateProductQuantity(product, quantity);
  }

  onShippingOptionChange(option: Shipping): void {
    this.selectedShippingOption = option;
    this.cartService.setSelectedShippingOption(option);
  }

  onApplyDiscount(): void {
    if (!this.discount.code) {
      this.discount.message = 'Please enter a discount code.';
      return;
    }

    this.cartService.applyDiscount(this.discount.code).subscribe(response => {
      if (response.status === 'success') {
        this.applySuccessfulDiscount(response);
      } else {
        this.discount.message = 'Discount code is not valid';
      }
    });
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  openCheckoutDialog(): void {
    const cartData = this.formatCartData(this.cartItems);

    this.cartService.checkAvailability(cartData).subscribe({
      next: (response: ResponseFormat<AvailabilityData[]>) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          const unavailableItems = response.data.filter(
            item => !item.isAvailable
          );

          if (unavailableItems.length > 0) {
            toast.error('Some products in care are not available');
          } else {
            this.isCheckoutDialogOpen = true;
          }
        } else {
          console.error('Invalid response format or data is not an array');
        }
      },
      error: error => {
        console.error('Error checking availability:', error);
      },
    });
  }

  handleDialogClose(): void {
    this.isCheckoutDialogOpen = false;
  }

  private applySuccessfulDiscount(response: Discount): void {
    this.discount = {
      ...this.discount,
      discount_amount: response.discount_amount,
      discount_type: response.discount_type,
      message: response.message,
    };

    this.cartService.setDiscount({
      code: response.code,
      discount_amount: response.discount_amount,
      discount_type: response.discount_type,
      message: response.message,
    });
  }
}
