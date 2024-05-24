import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Product } from '../types/product.model';
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
import { ImageGalleryComponent } from '../ui/image-gallery/image-gallery.component';
import { SelectComponent } from '../ui/ui-select/ui-select.component';
import { getStarsArray } from '../utils/utils';
@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [
    HlmIconComponent,
    CounterInputComponent,
    SelectComponent,
    HlmTabsComponent,
    HlmTabsContentDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    ImageGalleryComponent,
  ],
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInfoComponent implements OnInit {
  @Input() product: Product = {} as Product;

  selectedColorIndex: number = 0;
  sizes: string[] = [];
  colors: string[] = [];
  selectedSize: string = '';
  selectedColor: string = '';
  availableQuantity: number = 0;

  ngOnInit(): void {
    this.sizes = this.getUniqueSizes();
    this.setSizeAndColor(this.sizes[0]);
  }

  getUniqueSizes(): string[] {
    const sizesSet = new Set(
      this.product.variants.map(variant => variant.size)
    );

    return Array.from(sizesSet);
  }

  onSizeChanged(event: Event): void {
    const selectedElement = event.target as HTMLSelectElement;
    const newSize = selectedElement.value;
    this.setSizeAndColor(newSize);
  }

  setSizeAndColor(size: string): void {
    this.selectedSize = size;
    this.updateAvailableColors();
    this.selectedColor = this.colors[0];
    this.updateAvailableQuantity();
  }

  updateAvailableColors(): void {
    const colorSet = new Set(
      this.product.variants
        .filter(variant => variant.size === this.selectedSize)
        .map(variant => variant.color)
    );
    this.colors = Array.from(colorSet);
  }

  updateAvailableQuantity(): void {
    const variant = this.product.variants.find(
      variant =>
        variant.size === this.selectedSize &&
        variant.color === this.selectedColor
    );
    this.availableQuantity = variant ? variant.quantity : 0;
  }

  selectColorVariant(index: number): void {
    const color = this.colors[index];

    if (this.colors.includes(color)) {
      this.selectedColorIndex = index;
      this.selectedColor = color;
      this.updateAvailableQuantity();
    }
  }

  getStarsArray(): number[] {
    return getStarsArray();
  }
}
