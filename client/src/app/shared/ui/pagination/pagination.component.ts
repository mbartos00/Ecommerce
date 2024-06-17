import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  HlmPaginationContentDirective,
  HlmPaginationDirective,
  HlmPaginationEllipsisComponent,
  HlmPaginationItemDirective,
  HlmPaginationLinkDirective,
  HlmPaginationNextComponent,
  HlmPaginationPreviousComponent,
} from '../ui-pagination-helm/src';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    HlmPaginationContentDirective,
    HlmPaginationDirective,
    HlmPaginationEllipsisComponent,
    HlmPaginationItemDirective,
    HlmPaginationLinkDirective,
    HlmPaginationNextComponent,
    HlmPaginationPreviousComponent,
    CommonModule,
  ],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() totalPages: number[] = [];
  @Input() currentPage: number = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  pageRange: number = 1;
  edgePageCount: number = 1;

  get shouldShowLeftEllipsis(): boolean {
    return this.currentPage > this.pageRange + this.edgePageCount + 1;
  }

  get shouldShowRightEllipsis(): boolean {
    return (
      this.currentPage <
      this.totalPages.length - this.pageRange - this.edgePageCount
    );
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];

    const startPage = Math.max(
      this.currentPage - this.pageRange,
      this.edgePageCount + 1
    );
    const endPage = Math.min(
      this.currentPage + this.pageRange,
      this.totalPages.length - this.edgePageCount
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  gotoPage(page: number): void {
    this.pageChange.emit(page);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.gotoPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages.length) {
      this.gotoPage(this.currentPage + 1);
    }
  }
}
