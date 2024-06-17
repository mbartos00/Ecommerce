import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BestSellerList } from '@app/shared/types/product.model';
import { getStarsArray } from '@app/shared/utils/utils';
import { Observable, Subject, takeUntil } from 'rxjs';
import { HlmSkeletonComponent } from '../ui-skeleton-helm/src/lib/hlm-skeleton.component';
import { BestsellerService } from '@app/shared/bestseller-section/bestseller.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bestseller-card',
  standalone: true,
  templateUrl: './bestseller-card.component.html',
  imports: [CommonModule, RouterModule, HlmSkeletonComponent],
})
export class BestsellerCardComponent implements OnInit, OnDestroy {
  products$: Observable<BestSellerList> = new Observable<BestSellerList>();
  currentProductIndex = 0;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private bestsellerService: BestsellerService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.products$ = this.bestsellerService
      .getBestSellers()
      .pipe(takeUntil(this.destroy$));
  }

  prevProduct(event: Event): void {
    event.stopPropagation();

    if (this.currentProductIndex > 0) {
      this.currentProductIndex--;
    }
  }

  nextProduct(event: Event): void {
    event.stopPropagation();
    this.products$.pipe(takeUntil(this.destroy$)).subscribe(products => {
      this.currentProductIndex =
        (products?.data?.length ?? 0) > this.currentProductIndex + 1
          ? this.currentProductIndex + 1
          : this.currentProductIndex;
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
