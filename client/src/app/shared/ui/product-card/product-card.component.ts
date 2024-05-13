import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { exampleProduct } from './product-card.model';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideShoppingCart } from '@ng-icons/lucide';
import { Product } from '../../../../../../server/node_modules/@prisma/client';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  imports: [HlmIconComponent],
  providers: [provideIcons({ lucideHeart, lucideShoppingCart })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() product: Product = exampleProduct;

  getStarsArray(): number[] {
    const maxStars = 5;
    return Array(maxStars)
      .fill(0)
      .map((_, i) => (i < maxStars ? i + 1 : 0));
  }
}
