import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '@app/shared/types/product.model';

@Component({
  selector: 'app-sales-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sales-card.component.html',
  styles: `
    :host {
      @apply h-fit cursor-pointer shadow lg:shadow-none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesCardComponent {
  @Input() product!: Product;
}
