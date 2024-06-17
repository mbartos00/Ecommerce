import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideShoppingCart } from '@ng-icons/lucide';
import { Product } from '../../types/product.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HlmSkeletonComponent } from '../ui-skeleton-helm/src/lib/hlm-skeleton.component';

@Component({
  selector: 'app-product-list-card',
  standalone: true,
  templateUrl: './product-list-card.component.html',
  imports: [HlmIconComponent, CommonModule, HlmSkeletonComponent, RouterModule],
  providers: [provideIcons({ lucideHeart, lucideShoppingCart })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListCardComponent {
  @Input() product!: Omit<Product, 'favorites_list_id'>;

  getStarsArray(): number[] {
    const maxStars = 5;
    return Array(maxStars)
      .fill(0)
      .map((_, i) => (i < maxStars ? i + 1 : 0));
  }
}
