import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@app/shared/localstorage/localstorage.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type {
  Order,
  ProductList,
  QueryParams,
} from '../../types/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductListCardComponent } from '../product-list-card/product-list-card.component';
import { SortBarComponent } from '../sort-bar/sort-bar.component';
import { HlmPaginationContentDirective } from '../ui-pagination-helm/src/lib/hlm-pagination-content.directive';
import { HlmPaginationEllipsisComponent } from '../ui-pagination-helm/src/lib/hlm-pagination-ellipsis.componet';
import { HlmPaginationItemDirective } from '../ui-pagination-helm/src/lib/hlm-pagination-item.directive';
import { HlmPaginationLinkDirective } from '../ui-pagination-helm/src/lib/hlm-pagination-link.directive';
import { HlmPaginationNextComponent } from '../ui-pagination-helm/src/lib/hlm-pagination-next.componet';
import { HlmPaginationPreviousComponent } from '../ui-pagination-helm/src/lib/hlm-pagination-previous.componet';
import { HlmPaginationDirective } from '../ui-pagination-helm/src/lib/hlm-pagination.directive';
import { SortBarComponent } from '../sort-bar/sort-bar.component';
import { FormsModule } from '@angular/forms';
import type {
  Order,
  ProductList,
  QueryParams,
} from '../../types/product.model';
import { ProductListCardComponent } from '../product-list-card/product-list-card.component';
import { HlmSpinnerComponent } from '../ui-spinner-helm/src';

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
    HlmPaginationContentDirective,
    HlmPaginationDirective,
    HlmPaginationEllipsisComponent,
    HlmPaginationItemDirective,
    HlmPaginationLinkDirective,
    HlmPaginationNextComponent,
    HlmPaginationPreviousComponent,
    HlmSpinnerComponent,
    SortBarComponent,
    ProductListCardComponent,
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
  totalProducts: number = 10;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.currentPage = 1;
      this.category = params ? params['category'] : undefined;
      this.fetchProducts();
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
    const params: QueryParams = {
      page: this.currentPage.toString(),
      perPage: this.itemsPerPage,
      sortBy: this.sortBy,
      order: this.order,
      category: this.category,
    };

    this.products$ = this.http
      .get<ProductList>(`${environment.API_URL}/products`, {
        params,
      })
      .pipe(takeUntil(this.destroy$));

    this.products$.subscribe(response => {
      this.totalProducts = response.paginationInfo.count;
      this.totalPages = Array.from(
        { length: response.paginationInfo.totalPages },
        (_, index) => index + 1
      );
    });
  }
}
