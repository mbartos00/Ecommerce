import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductCardComponent } from '../ui/product-card/product-card.component';
import { BestSellerList, Category } from '../types/product.model';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { HlmSpinnerComponent } from '../ui/ui-spinner-helm/src';
import { Router } from '@angular/router';
import { CategoryService } from '../data-access/category.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-bestseller-section',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, HlmSpinnerComponent],
  templateUrl: './bestseller-section.component.html',
})
export class BestsellerSectionComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  activeTabIndex: number = 0;
  productsSubject = new BehaviorSubject<BestSellerList | null>(null);
  products$ = this.productsSubject.asObservable();

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private categoryService: CategoryService
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
        console.log(this.categories);
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

    const url =
      selectedCategory === 'all'
        ? `${environment.API_URL}/products/bestsellers`
        : `${environment.API_URL}/products/bestsellers?category=${selectedCategory}`;

    console.log(selectedCategory);

    this.products$ = this.http
      .get<BestSellerList>(url)
      .pipe(takeUntil(this.destroy$));
  }

  onLoadMore(): void {
    this.router.navigate(['/products']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
