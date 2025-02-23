import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideFacebook,
  lucideHeart,
  lucideShoppingCart,
  lucideTwitter,
} from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import {
  HlmTabsComponent,
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';
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
  catchError,
  throwError,
} from 'rxjs';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { Product, ProductInCart, Variant } from '../types/product.model';
import { BestsellerCardComponent } from '../ui/bestseller-card/bestseller-card.component';
import { CounterInputComponent } from '../ui/counter-input/counter-input.component';
import { ImageGalleryComponent } from '../ui/image-gallery/image-gallery.component';
import { ProductCardComponent } from '../ui/product-card/product-card.component';
import { SelectComponent } from '../ui/ui-select/ui-select.component';
import calculateDiscountedPrice from '../utils/calculate-discounted-price';
import { getStarsArray } from '../utils/utils';
import { FavoriteService } from '../../favorite/favorite.service';
import { toast } from 'ngx-sonner';
import { UserService } from '../data-access/user.service';

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
    ProductCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInfoComponent implements OnInit {
  @Input() product: Product = {} as Product;
  selectedProduct: ProductInCart = {} as ProductInCart;
  product$: Observable<Product> = of();
  sizes$: Observable<string[]> = of();
  colors$: Observable<string[]> = of();
  isLoading = true;
  selectedSize$ = new BehaviorSubject<string>('');
  selectedColor$ = new BehaviorSubject<string>('');
  selectedColorIndex: number = 0;
  quantityToBuy: number = 1;
  relatedProducts!: Product[];
  calculateDiscountedPrice!: (product: Product) => number;
  isFavorite$: Observable<boolean> = new Observable<boolean>();
  isAuthenticated!: Observable<boolean>;
  private DEFAULT_RELATED_PRODUCTS_LIMIT = 4;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    private favoriteService: FavoriteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.userService.user$.pipe(map(d => d.isAuth));
    this.route.params.subscribe(() => {
      this.initOptions();
    });
    this.isLoading = false;
    this.calculateDiscountedPrice = calculateDiscountedPrice;
    this.getRelatedProducts().subscribe(d => {
      this.relatedProducts = d;
    });
    const productId = this.route.snapshot.paramMap.get('id');

    this.isFavorite$ = this.favoriteService.favoriteList$.pipe(
      map(favorites => favorites.products.some(fav => fav.id === productId))
    );
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

  getRelatedProducts(): Observable<Product[]> {
    return this.product$.pipe(
      map(d => d.categories[0]),
      take(1),
      switchMap(data => {
        return this.productService
          .getAllProducts({
            category: data.name,
            perPage: String(this.DEFAULT_RELATED_PRODUCTS_LIMIT),
          })
          .pipe(map(d => d.data));
      })
    );
  }

  addToCart(): void {
    this.getVariant()
      .pipe(
        take(1),
        switchMap(variant => {
          if (!variant) {
            return EMPTY;
          }
          return this.product$.pipe(
            take(1),
            tap(product => {
              if (product) {
                this.selectedProduct = {
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  price: product.discount
                    ? calculateDiscountedPrice(product)
                    : product.price,
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

  toggleFavorites(event: Event, productId: string): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.favoriteService.isFavorite(productId)) {
      this.favoriteService
        .removeFavorite(productId)
        .pipe(
          catchError(err => {
            toast.error('Failed to remove product from favorites');
            return throwError(() => err.message);
          })
        )
        .subscribe(() => {
          toast.success('Product removed from favorites');
        });
    } else {
      this.favoriteService
        .addFavorite(productId)
        .pipe(
          catchError(err => {
            toast.error('Failed to add product to favorites');
            return throwError(() => err.message);
          })
        )
        .subscribe(() => {
          toast.success('Product added to favorites');
        });
    }
  }
}
