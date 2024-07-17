import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { getStarsArray } from '@app/shared/utils/utils';
import { lucideHeart, lucideShoppingCart } from '@ng-icons/lucide';
import { Product } from '../../types/product.model';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { FavoriteService } from '@app/favorite/favorite.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { toast } from 'ngx-sonner';
import { UserService } from '@app/shared/data-access/user.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  imports: [
    HlmIconComponent,
    CurrencyPipe,
    DecimalPipe,
    CommonModule,
    RouterModule,
    SkeletonCardComponent,
  ],
  providers: [provideIcons({ lucideHeart, lucideShoppingCart })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent implements OnInit {
  @Input() product: Product = {} as Product;
  isAuthenticated$!: Observable<boolean>;
  isFavorite$: Observable<boolean | undefined> = new Observable<
    boolean | undefined
  >();

  constructor(
    private favoriteService: FavoriteService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isFavorite$ = this.favoriteService.favoriteList$.pipe(
      map(favorites =>
        favorites?.products.some(fav => fav.id === this.product.id)
      )
    );

    this.isAuthenticated$ = this.userService.user$.pipe(map(d => d.isAuth));
  }

  getStarsArray(): number[] {
    return getStarsArray();
  }

  toggleFavorites(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.favoriteService.isFavorite(this.product.id)) {
      this.favoriteService
        .removeFavorite(this.product.id)
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
        .addFavorite(this.product.id)
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
