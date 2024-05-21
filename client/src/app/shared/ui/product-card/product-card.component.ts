import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideShoppingCart } from '@ng-icons/lucide';
import { Product } from '../../types/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  imports: [HlmIconComponent],
  providers: [provideIcons({ lucideHeart, lucideShoppingCart })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() product: Product = {} as Product;

  getStarsArray(): number[] {
    const maxStars = 5;
    return Array(maxStars)
      .fill(0)
      .map((_, i) => (i < maxStars ? i + 1 : 0));
  }
}
