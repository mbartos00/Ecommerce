import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Product } from '@app/shared/types/product.model';
import { Observable } from 'rxjs';
import { SalesCardComponent } from './ui/sales-card.component';
import { ProductService } from '@app/shared/product/product.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [SalesCardComponent, AsyncPipe],
  templateUrl: './sales.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesComponent implements OnInit {
  products$!: Observable<Product[]>;
  productService = inject(ProductService);

  ngOnInit(): void {
    this.products$ = this.productService.getProductsOnSale();
  }
}
