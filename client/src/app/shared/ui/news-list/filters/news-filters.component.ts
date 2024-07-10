import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NewsService } from '@app/shared/news/data-access/news.service';
import removeNullishProperties from '@app/shared/utils/remove-nullish-props';
import { Observable, map } from 'rxjs';
import { AutocompleteComponent } from '../../autocomplete/autocomplete.component';
import { FormInputComponent } from '../../form-input/form-input.component';
import { FilterWrapperComponent } from '../../product-list/filters/filter-wrapper.component';
import { HlmSpinnerComponent } from '../../ui-spinner-helm/src';

@Component({
  selector: 'app-news-filters',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    AutocompleteComponent,
    HlmSpinnerComponent,
    ReactiveFormsModule,
    FormInputComponent,
    FilterWrapperComponent,
  ],
  templateUrl: './news-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsFiltersComponent implements OnInit {
  @Output() closeDrawer = new EventEmitter<void>();
  filters$!: Observable<string[]>;
  form!: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private newsService = inject(NewsService);

  ngOnInit(): void {
    this.form = this.fb.group({
      category: new FormControl(null),
      search: new FormControl(null),
    });

    this.filters$ = this.newsService
      .getNewsCategories()
      .pipe(map(d => d.map(i => i.name)));
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get categoryControl(): FormControl {
    return this.form.get('category') as FormControl;
  }

  onCategorySelect(value: string): void {
    this.categoryControl.setValue(value);
  }

  applyFilters(): void {
    this.closeDrawer.emit();
    const values = removeNullishProperties(this.form.getRawValue());
    this.router.navigate(['/news'], { queryParams: values });
  }

  resetFilters(): void {
    this.closeDrawer.emit();
    this.form.reset();
    this.router.navigate(['/news']);
  }
}
