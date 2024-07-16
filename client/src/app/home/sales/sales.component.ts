import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ProductService } from '@app/shared/product/product.service';
import { Product } from '@app/shared/types/product.model';
import { HlmSkeletonComponent } from '@app/shared/ui/ui-skeleton-helm/src';
import { Observable, tap } from 'rxjs';
import { SalesCardComponent } from './ui/sales-card.component';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [SalesCardComponent, AsyncPipe, HlmSkeletonComponent],
  templateUrl: './sales.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesComponent implements OnInit {
  products$!: Observable<Product[]>;
  productService = inject(ProductService);
  productsLength!: number;

  ngOnInit(): void {
    this.products$ = this.productService.getProductsOnSale().pipe(
      tap(d => {
        this.productsLength = d.length;
      })
    );
  }
}
