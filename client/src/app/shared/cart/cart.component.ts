import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { Observable, map } from 'rxjs';
import { UserService } from '../data-access/user.service';
import { Discount } from '../types/discount';
import { ProductInCart } from '../types/product.model';
import { CounterInputComponent } from '../ui/counter-input/counter-input.component';
import { CartService } from './cart.service';
import { Shipping } from '../types/shipping';
import { RadioComponent } from '../ui/radio-button/radio.component';
import { HlmButtonDirective } from '../ui/ui-button-helm/src';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  providers: [provideIcons({ lucideX })],
  imports: [
    HlmIconComponent,
    CommonModule,
    CounterInputComponent,
    FormsModule,
    RadioComponent,
    HlmButtonDirective,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {
  productsInCart$: Observable<ProductInCart[]> = this.cartService.cart$;
  subtotal$: Observable<number> = this.cartService.getSubtotal();
  shippingOptions$: Observable<Shipping[]> = new Observable<Shipping[]>();
  selectedShippingOption: Shipping | null = null;
  isAuthenticated$!: Observable<boolean>;
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
