import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@app/shared/localstorage/localstorage.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SortBarComponent } from '../sort-bar/sort-bar.component';
import { FormsModule } from '@angular/forms';
import type {
  Order,
  ProductList,
  QueryParams,
} from '../../types/product.model';
import { ProductListCardComponent } from '../product-list-card/product-list-card.component';
import { HlmSpinnerComponent } from '../ui-spinner-helm/src';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ProductService } from '@app/shared/product/product.service';
import {
  HlmPaginationNextComponent,
  HlmPaginationPreviousComponent,
} from '../ui-pagination-helm/src';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ProductCardComponent,
    ProductListCardComponent,
    CommonModule,
    HlmSpinnerComponent,
    SortBarComponent,
    ProductListCardComponent,
    SkeletonCardComponent,
    PaginationComponent,
    HlmPaginationNextComponent,
    HlmPaginationPreviousComponent,
  ],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products$: Observable<ProductList> = new Observable<ProductList>();
  isGridView: boolean = true;
  currentPage: number = 1;
  totalPages: number[] = [];
  itemsPerPage: string = '20';
  sortBy: string = 'name';
  order: Order = 'asc';
  category: string | undefined = undefined;
  searchbarValue: string | undefined;
  totalProducts: number = 10;
  isLoading: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.currentPage = 1;
      this.category = params['category'];
      this.searchbarValue = params['search'];
      this.fetchProducts();
      this.cdr.detectChanges();
    });

    if (this.localStorageService.getItem('productView') !== null) {
      this.isGridView = this.localStorageService.getItem('productView')!;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onViewTypeChange(value: boolean): void {
    this.localStorageService.setItem('productView', value);
    this.isGridView = value;
  }

  onSortCriteriaChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.currentPage = 1;
    this.fetchProducts();
  }

  onProductsPerPageChange(limit: string): void {
    this.itemsPerPage = limit;
    this.currentPage = 1;
    this.fetchProducts();
  }

  onOrderChange(order: string): void {
    this.order = order as Order;
    this.currentPage = 1;
    this.fetchProducts();
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchProducts();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
      this.fetchProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchProducts();
    }
  }
  gotoPage(page: number): void {
    this.currentPage = page;
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading = true;
    const params: QueryParams = {
      page: this.currentPage.toString(),
      perPage: this.itemsPerPage,
      sortBy: this.sortBy,
      order: this.order,
      category: this.category,
      search: this.searchbarValue,
    };

    this.products$ = this.productService.getAllProducts(params);

    this.products$.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.totalProducts = response.paginationInfo.count;
      this.totalPages = Array.from(
        { length: response.paginationInfo.totalPages },
        (_, index) => index + 1
      );
    });
    this.isLoading = false;
  }
}
