import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { ProductInCart } from '../types/product.model';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CounterInputComponent } from '../ui/counter-input/counter-input.component';
import { FormsModule } from '@angular/forms';
import { Discount } from '../types/discount';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  providers: [provideIcons({ lucideX })],
  imports: [HlmIconComponent, CommonModule, CounterInputComponent, FormsModule],
})
export class CartComponent {
  productsInCart$: Observable<ProductInCart[]> = this.cartService.cart$;
  subtotal$: Observable<number> = this.cartService.getSubtotal();
  discount: Discount = {
    code: '',
    discount_amount: 0,
    discount_type: '',
    message: '',
  };

  constructor(private cartService: CartService) {}

  onDeleteProductFromCart(product: ProductInCart): void {
    this.cartService.removeProductFromCart(product);
  }

  onQuantityChange(product: ProductInCart, quantity: number): void {
    this.cartService.updateProductQuantity(product, quantity);
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
