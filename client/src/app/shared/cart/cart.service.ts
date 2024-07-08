import { Injectable } from '@angular/core';
import { ProductInCart } from '../types/product.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Discount } from '../types/discount';
import { Shipping } from '../types/shipping';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private productsInCart: ProductInCart[] = JSON.parse(
    localStorage.getItem('cart') || '[]'
  );
  private discount: Discount = {
    code: '',
    discount_amount: 0,
    discount_type: '',
    message: '',
  };
  private selectedShippingOption: Shipping | null = null;
  private cartSubject: BehaviorSubject<ProductInCart[]> = new BehaviorSubject<
    ProductInCart[]
  >(this.productsInCart);

  constructor(private http: HttpClient) {}

  get cart$(): Observable<ProductInCart[]> {
    return this.cartSubject.asObservable();
  }

  get cartItemsCount(): number {
    return this.cartSubject
      .getValue()
      .reduce((acc: number, curr: ProductInCart): number => {
        return acc + curr.quantityToBuy;
      }, 0);
  }

  addToCart(product: ProductInCart): void {
    const existingProduct = this.productsInCart.find(
      p => p.variantId === product.variantId
    );

    if (existingProduct) {
      this.updateProductQuantity(
        existingProduct,
        existingProduct.quantityToBuy + product.quantityToBuy
      );
    } else {
      this.productsInCart.push({
        ...product,
        quantityToBuy: product.quantityToBuy,
      });
      this.cartSubject.next(this.productsInCart);
      this.saveCart();
    }
  }

  removeProductFromCart(product: ProductInCart): void {
    this.productsInCart = this.productsInCart.filter(
      p => p.variantId !== product.variantId
    );
    this.cartSubject.next(this.productsInCart);
    this.saveCart();
  }

  updateProductQuantity(product: ProductInCart, quantity: number): void {
    const productToUpdate = this.productsInCart.find(
      p => p.variantId === product.variantId
    );
    if (
      productToUpdate &&
      productToUpdate.availableQuantity >= productToUpdate.quantityToBuy
    ) {
      productToUpdate.quantityToBuy = quantity;
      this.cartSubject.next(this.productsInCart);
      this.saveCart();
    }
  }

  getSubtotal(): Observable<number> {
    return this.cart$.pipe(
      map(products =>
        products.reduce(
          (acc, product) => acc + product.price * product.quantityToBuy,
          0
        )
      )
    );
  }

  applyDiscount(code: string): Observable<Discount> {
    return this.http.post<Discount>(environment.API_URL + '/cart/discount', {
      code: code,
    });
  }

  setDiscount(discount: Discount): void {
    this.discount = discount;
  }

  getDiscount(): Discount {
    return this.discount;
  }

  getShippingOptions(): Observable<Shipping[]> {
    return this.http
      .get<{
        status: string;
        data: Shipping[];
      }>(environment.API_URL + '/cart/shipping')
      .pipe(map(response => response.data));
  }

  setSelectedShippingOption(shipping: Shipping): void {
    this.selectedShippingOption = shipping;
  }

  getTotal(): number {
    const subtotal = this.cartSubject
      .getValue()
      .reduce((acc, product) => acc + product.price * product.quantityToBuy, 0);

    if (this.discount.discount_type === 'percentage') {
      return parseFloat(
        (subtotal - (subtotal * this.discount.discount_amount) / 100).toFixed(2)
      );
    }
    return subtotal - this.discount.discount_amount;
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.productsInCart));
  }
}
