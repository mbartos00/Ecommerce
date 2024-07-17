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
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HlmSkeletonComponent } from '../ui-skeleton-helm/src/lib/hlm-skeleton.component';
import { FavoriteService } from '@app/favorite/favorite.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { toast } from 'ngx-sonner';
import { UserService } from '@app/shared/data-access/user.service';

@Component({
  selector: 'app-product-list-card',
  standalone: true,
  templateUrl: './product-list-card.component.html',
  imports: [HlmIconComponent, CommonModule, HlmSkeletonComponent, RouterModule],
  providers: [provideIcons({ lucideHeart, lucideShoppingCart })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListCardComponent implements OnInit {
  @Input() product!: Omit<Product, 'favorites_list_id'>;
  isAuthenticated$!: Observable<boolean>;
  isFavorite$: Observable<boolean> = new Observable<boolean>();

  constructor(
    private favoriteService: FavoriteService,
    private userService: UserService
  ) {
    this.isAuthenticated$ = this.userService.user$.pipe(map(d => d.isAuth));
  }

  ngOnInit(): void {
    this.isFavorite$ = this.favoriteService.favoriteList$.pipe(
      map(favorites =>
        favorites.products.some(fav => fav.id === this.product.id)
      )
    );
  }

  getStarsArray(): number[] {
    return getStarsArray();
  }

  toggleFavorites(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.favoriteService.isFavorite(this.product.id)) {
      this.removeFromFavorites(this.product.id);
    } else {
      this.addToFavorites(this.product.id);
    }
  }

  private addToFavorites(productId: string): void {
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

  private removeFromFavorites(productId: string): void {
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
  }
}
