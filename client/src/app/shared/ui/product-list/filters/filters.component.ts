/* eslint-disable @typescript-eslint/member-ordering */
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
import { Filters, ProductService } from '@app/shared/product/product.service';
import removeNullishProperties from '@app/shared/utils/remove-nullish-props';
import { Observable } from 'rxjs';
import { AutocompleteComponent } from '../../autocomplete/autocomplete.component';
import { FormInputComponent } from '../../form-input/form-input.component';
import { HlmSpinnerComponent } from '../../ui-spinner-helm/src';
import { FilterWrapperComponent } from './filter-wrapper.component';

@Component({
  selector: 'app-product-filters',
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
  templateUrl: './filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFiltersComponent implements OnInit {
  @Output() closeDrawer = new EventEmitter<void>();
  filters$!: Observable<Filters>;
  form!: FormGroup;
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  ngOnInit(): void {
    this.form = this.fb.group({
      brand: new FormControl(null),
      size: new FormControl(null),
      condition: new FormControl(null),
      color: new FormControl(null),
      min_price: new FormControl(null),
      max_price: new FormControl(null),
    });

    this.filters$ = this.productService.getProductFilters();
  }

  get brandControl(): FormControl {
    return this.form.get('brand') as FormControl;
  }

  get sizeControl(): FormControl {
    return this.form.get('size') as FormControl;
  }

  get conditionControl(): FormControl {
    return this.form.get('condition') as FormControl;
  }

  get colorControl(): FormControl {
    return this.form.get('color') as FormControl;
  }

  onBrandSelected(value: string): void {
    this.brandControl.setValue(value);
  }

  onSizeSelected(value: string): void {
    this.sizeControl.setValue(value);
  }

  onConditionSelected(value: string): void {
    this.conditionControl.setValue(value);
  }

  onColorSelected(value: string): void {
    this.colorControl.setValue(value);
  }

  applyFilters(): void {
    this.closeDrawer.emit();
    const values = removeNullishProperties(this.form.getRawValue());
    this.router.navigate(['/shop'], { queryParams: values });
  }

  resetFilters(): void {
    this.closeDrawer.emit();
    this.form.reset();
    this.router.navigate(['/shop']);
  }
}
