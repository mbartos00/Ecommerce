import { Component, OnInit } from '@angular/core';
import { Product, ProductInCart, Variant } from '../types/product.model';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import {
  lucideHeart,
  lucideShoppingCart,
  lucideFacebook,
  lucideTwitter,
  lucideChevronLeft,
  lucideChevronRight,
} from '@ng-icons/lucide';
import { CounterInputComponent } from '../ui/counter-input/counter-input.component';
import {
  HlmTabsComponent,
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { ImageGalleryComponent } from '../ui/image-gallery/image-gallery.component';
import { SelectComponent } from '../ui/ui-select/ui-select.component';
import { getStarsArray } from '../utils/utils';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart/cart.service';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  combineLatest,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { BestsellerCardComponent } from '../ui/bestseller-card/bestseller-card.component';

@Component({
  selector: 'app-product-info',
  standalone: true,
  providers: [
    provideIcons({
      lucideHeart,
      lucideShoppingCart,
      lucideFacebook,
      lucideTwitter,
      lucideChevronRight,
      lucideChevronLeft,
    }),
  ],
  templateUrl: './product-info.component.html',
  imports: [
    HlmIconComponent,
    CounterInputComponent,
    SelectComponent,
    HlmTabsComponent,
    HlmTabsContentDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    ImageGalleryComponent,
    HlmSpinnerComponent,
    CommonModule,
    BestsellerCardComponent,
  ],
})
export class ProductInfoComponent implements OnInit {
  selectedProduct: ProductInCart = {} as ProductInCart;
  product$: Observable<Product> = of();
  sizes$: Observable<string[]> = of();
  colors$: Observable<string[]> = of();
  isLoading = true;
  selectedSize$ = new BehaviorSubject<string>('');
  selectedColor$ = new BehaviorSubject<string>('');
  selectedColorIndex: number = 0;
  quantityToBuy: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.initOptions();
    this.isLoading = false;
  }

  initOptions(): void {
    this.product$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(productId => this.productService.getProductById(productId))
    );

    this.sizes$ = this.product$.pipe(
      map(product => {
        const sizes = Array.from(
          new Set(product.variants.map(variant => variant.size))
        );
        const defaultSize = sizes[0];
        this.selectedSize$.next(defaultSize);
        return sizes;
      })
    );

    this.colors$ = combineLatest([this.product$, this.selectedSize$]).pipe(
      map(([product, selectedSize]) =>
        Array.from(
          new Set(
            product.variants
              .filter(variant => variant.size === selectedSize)
              .map(variant => variant.color)
          )
        )
      )
    );
  }

  addToCart(): void {
    this.getVariant()
      .pipe(
        switchMap(variant => {
          if (!variant) {
            return EMPTY;
          }
          return this.product$.pipe(
            tap(product => {
              if (product) {
                this.selectedProduct = {
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  price: product.price,
                  images: product.images,
                  variantId: variant.id,
                  color: variant.color,
                  condition: variant.condition,
                  size: variant.size,
                  availableQuantity: variant.quantity,
                  quantityToBuy: this.quantityToBuy,
                };
                this.cartService.addToCart(this.selectedProduct);
              } else {
                console.error('Product not found.');
              }
            })
          );
        })
      )
      .subscribe();
  }

  setSizeAndColor(size: string, color: string = ''): void {
    this.selectedProduct.size = size;
    this.selectedSize$.next(size);

    this.colors$
      .pipe(
        take(1),
        tap(colors => {
          const newColor = color || colors[0];
          this.selectedColor$.next(newColor);
          this.selectedProduct.color = newColor;
          this.selectedColorIndex = colors.indexOf(newColor);
          this.updateAvailableQuantity();
        })
      )
      .subscribe();
  }

  onQuantityChange(newQuantity: number): void {
    this.quantityToBuy = newQuantity;
  }

  updateAvailableQuantity(): void {
    this.getVariant()
      .pipe(
        take(1),
        tap(variant => {
          this.selectedProduct.availableQuantity = variant
            ? variant.quantity
            : 0;
        })
      )
      .subscribe();
  }

  selectColorVariant(index: number): void {
    this.colors$
      .pipe(
        take(1),
        tap(colors => {
          this.selectedColorIndex = index;
          const newColor = colors[index];
          this.selectedColor$.next(newColor);
          this.selectedProduct.color = newColor;
          this.updateAvailableQuantity();
        })
      )
      .subscribe();
  }

  getVariant(): Observable<Variant | undefined> {
    return combineLatest([
      this.product$,
      this.selectedSize$,
      this.selectedColor$,
    ]).pipe(
      map(([product, selectedSize, selectedColor]) =>
        product.variants.find(
          variant =>
            variant.size.toString() === selectedSize &&
            variant.color === selectedColor
        )
      )
    );
  }

  getStarsArray(): number[] {
    return getStarsArray();
  }
}
