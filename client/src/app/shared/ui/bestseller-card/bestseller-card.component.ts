import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BestSellerList, Product } from '@app/shared/types/product.model';
import { getStarsArray } from '@app/shared/utils/utils';
import { Observable, Subject, takeUntil } from 'rxjs';
import { HlmSkeletonComponent } from '../ui-skeleton-helm/src/lib/hlm-skeleton.component';
import { BestsellerService } from '@app/shared/bestseller-section/bestseller.service';
import { RouterModule } from '@angular/router';
import calculateDiscountedPrice from '@app/shared/utils/calculate-discounted-price';
import { provideIcons } from '@ng-icons/core';
import { HlmIconComponent } from '../ui-icon-helm/src';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';

@Component({
  selector: 'app-bestseller-card',
  standalone: true,
  templateUrl: './bestseller-card.component.html',
  imports: [CommonModule, RouterModule, HlmSkeletonComponent, HlmIconComponent],
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BestsellerCardComponent implements OnInit, OnDestroy {
  products$: Observable<BestSellerList> = new Observable<BestSellerList>();
  currentProductIndex = 0;
  calculateDiscountedPrice!: (product: Product) => number;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private bestsellerService: BestsellerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.calculateDiscountedPrice = calculateDiscountedPrice;
  }

  fetchProducts(): void {
    this.products$ = this.bestsellerService
      .getBestSellers()
      .pipe(takeUntil(this.destroy$));
  }

  prevProduct(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.currentProductIndex > 0) {
      this.currentProductIndex--;
    }
  }

  nextProduct(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.products$.pipe(takeUntil(this.destroy$)).subscribe(products => {
      this.currentProductIndex =
        (products?.data?.length ?? 0) > this.currentProductIndex + 1
          ? this.currentProductIndex + 1
          : this.currentProductIndex;
      this.cdr.detectChanges();
    });
  }

  setCurrentProduct(index: number): void {
    this.currentProductIndex = index;
  }

  getStarsArray(): number[] {
    return getStarsArray();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
