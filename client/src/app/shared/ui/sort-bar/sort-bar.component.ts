import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { HlmIconComponent } from '../ui-icon-helm/src/lib/hlm-icon.component';
import { provideIcons } from '@ng-icons/core';
import { lucideLayoutGrid, lucideList } from '@ng-icons/lucide';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sort-bar',
  standalone: true,
  templateUrl: './sort-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmIconComponent, CommonModule],
  providers: [provideIcons({ lucideList, lucideLayoutGrid })],
})
// SortBarComponent
export class SortBarComponent {
  @Input() totalProducts: number = 1;
  @Output() viewTypeChange = new EventEmitter<boolean>();
  @Output() sortCriteriaChange = new EventEmitter<string>();
  @Output() productsPerPageChange = new EventEmitter<string>();
  @Output() orderChange = new EventEmitter<string>();

  updateSortCriteria(e: Event): void {
    this.sortCriteriaChange.emit((e.target as HTMLTextAreaElement).value);
  }

  updateLimit(e: Event): void {
    this.productsPerPageChange.emit((e.target as HTMLTextAreaElement).value);
  }

  updateOrder(e: Event): void {
    this.orderChange.emit((e.target as HTMLTextAreaElement).value);
  }

  setViewType(isGridView: boolean): void {
    this.viewTypeChange.emit(isGridView);
  }

  getViewTypeClass(): string {
    return this.viewTypeChange ? 'bg-primary' : '';
  }
}