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
import { NewsService } from '@app/shared/news/data-access/news.service';
import { NewsList, QueryParams } from '@app/shared/types/news.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import type { Order } from '../../types/product.model';
import { DrawerComponent } from '../drawer/drawer.component';
import { NewsCardComponent } from '../news-card/news-card.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { SortBarComponent } from '../sort-bar/sort-bar.component';
import { HlmSpinnerComponent } from '../ui-spinner-helm/src';
import { NewsFiltersComponent } from './filters/news-filters.component';

@Component({
  selector: 'app-news-list',
  standalone: true,
  templateUrl: './news-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CommonModule,
    HlmSpinnerComponent,
    SortBarComponent,
    SkeletonCardComponent,
    PaginationComponent,
    NewsCardComponent,
    DrawerComponent,
    NewsFiltersComponent,
  ],
})
export class NewsListComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: DrawerComponent;
  news$: Observable<NewsList> = new Observable<NewsList>();
  currentPage: number = 1;
  totalPages: number[] = [];
  itemsPerPage: string = '20';
  sortBy: string = 'title';
  order: Order = 'asc';
  category?: string;
  searchbarValue?: string;
  totalNews: number = 10;
  isLoading: boolean = false;
  sortOptions = ['title', 'createdAt'];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.currentPage = 1;
      this.category = params['category'];
      this.searchbarValue = params['search'];
      this.fetchNews();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSortCriteriaChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.currentPage = 1;
    this.fetchNews();
  }

  onNewsPerPageChange(limit: string): void {
    this.itemsPerPage = limit;
    this.currentPage = 1;
    this.fetchNews();
  }

  onOrderChange(order: string): void {
    this.order = order as Order;
    this.currentPage = 1;
    this.fetchNews();
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchNews();
  }

  gotoPage(page: number): void {
    this.currentPage = page;
    this.fetchNews();
  }

  openFilterDrawer(): void {
    this.drawer.openDrawer();
  }

  closeDrawer(): void {
    this.drawer.closeDrawer();
    this.cdr.detectChanges();
  }

  fetchNews(): void {
    this.isLoading = true;
    const params: QueryParams = {
      page: this.currentPage.toString(),
      perPage: this.itemsPerPage,
      sortBy: this.sortBy,
      order: this.order,
      category: this.category,
      search: this.searchbarValue,
    };

    this.news$ = this.newsService.getAllNews(params);

    this.news$.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.totalNews = response.paginationInfo.count;
      this.totalPages = Array.from(
        { length: response.paginationInfo.totalPages },
        (_, index) => index + 1
      );
    });

    this.isLoading = false;
    this.cdr.detectChanges();
  }
}
