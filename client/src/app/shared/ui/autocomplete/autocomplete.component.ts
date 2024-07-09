import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ClickOutsideDirective } from '../../directives/dropdown.directive';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideChevronUp } from '@ng-icons/lucide';
import { HlmIconComponent } from '../ui-icon-helm/src';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClickOutsideDirective,
    HlmIconComponent,
  ],
  providers: [provideIcons({ lucideChevronDown, lucideChevronUp })],
  templateUrl: './autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements OnInit {
  @Input() options: string[] = [];
  @Input() control!: FormControl;
  @Input() placeholder = 'Search';
  @Output() selectedValue = new EventEmitter<string>();

  filteredOptions$!: Observable<string[]>;
  showDropDown = false;
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.filteredOptions$ = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || ''))
    );
  }

  onSelect(option: string): void {
    this.control.setValue(option);
    this.selectedValue.emit(option);
    this.closeDropDown();

    this.cdr.markForCheck();
  }

  closeDropDown(): void {
    this.showDropDown = false;
  }

  openDropDown(): void {
    this.showDropDown = true;
  }

  handleEscapeKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.closeDropDown();
    }
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
