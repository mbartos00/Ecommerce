import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@app/shared/localstorage/localstorage.service';
import { ProductService } from '@app/shared/product/product.service';
import { SneakerSectionComponent } from '@app/shared/sneaker-section/sneaker-section.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import type {
  Order,
  ProductList,
  QueryParams,
} from '../../types/product.model';
import { DrawerComponent } from '../drawer/drawer.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductListCardComponent } from '../product-list-card/product-list-card.component';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { SortBarComponent } from '../sort-bar/sort-bar.component';
import {
  HlmPaginationNextComponent,
  HlmPaginationPreviousComponent,
} from '../ui-pagination-helm/src';
import { HlmSpinnerComponent } from '../ui-spinner-helm/src';
import { ProductFiltersComponent } from './filters/filters.component';

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
    SneakerSectionComponent,
    ProductFiltersComponent,
    DrawerComponent,
  ],
})
export class ProductListComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: DrawerComponent;
  products$: Observable<ProductList> = new Observable<ProductList>();
  isGridView: boolean = true;
  currentPage: number = 1;
  totalPages: number[] = [];
  itemsPerPage: string = '20';
  sortBy: string = 'name';
  order: Order = 'asc';
  category?: string;
  brand?: string;
  min_price?: string;
  max_price?: string;
  condition?: string;
  color?: string;
  size?: string;
  searchbarValue?: string;
  totalProducts: number = 10;
  isLoading: boolean = false;
  sortOptions = ['name', 'price', 'rating'];
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
      this.brand = params['brand'];
      this.min_price = params['min_price'];
      this.max_price = params['max_price'];
      this.condition = params['condition'];
      this.color = params['color'];
      this.size = params['size'];
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
      brand: this.brand,
      min_price: this.min_price,
      max_price: this.max_price,
      color: this.color,
      size: this.size,
      condition: this.condition,
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
    this.cdr.detectChanges();
  }

  openFilterDrawer(): void {
    this.drawer.openDrawer();
  }

  closeDrawer(): void {
    this.drawer.closeDrawer();
    this.cdr.detectChanges();
  }
}
