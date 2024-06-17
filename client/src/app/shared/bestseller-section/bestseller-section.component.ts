import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductCardComponent } from '../ui/product-card/product-card.component';
import { BestSellerList, Category } from '../types/product.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HlmSpinnerComponent } from '../ui/ui-spinner-helm/src';
import { Router } from '@angular/router';
import { CategoryService } from '../data-access/category.service';
import { map } from 'rxjs/operators';
import { BestsellerService } from './bestseller.service';

@Component({
  selector: 'app-bestseller-section',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, HlmSpinnerComponent],
  templateUrl: './bestseller-section.component.html',
})
export class BestsellerSectionComponent implements OnInit, OnDestroy {
  products$: Observable<BestSellerList> = new Observable<BestSellerList>();
  categories: Category[] = [];
  activeTabIndex: number = 0;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private bestsellerService: BestsellerService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchProducts();
  }

  setActiveTabIndex(index: number): void {
    this.activeTabIndex = index;
    this.fetchProducts();
  }

  fetchCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(
        map(data =>
          data
            .map(category => ({
              id: category.id,
              name: category.name,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        )
      )
      .subscribe(categories => {
        this.categories = [{ id: 'all', name: 'All' }, ...categories];
      });
  }

  fetchProducts(): void {
    let selectedCategory: string;

    if (this.activeTabIndex === 0 || this.categories.length === 0) {
      selectedCategory = 'all';
    } else {
      const categoryIndex = this.activeTabIndex;
      selectedCategory = this.categories[categoryIndex]?.id || 'all';
    }

    this.products$ = this.bestsellerService
      .getBestSellersByCategory(selectedCategory)
      .pipe(takeUntil(this.destroy$));
  }

  onLoadMore(): void {
    this.router.navigate(['/shop']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
