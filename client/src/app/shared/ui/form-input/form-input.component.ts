import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Self,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  DefaultValueAccessor,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { getValidationErrorMessage } from '@app/shared/utils/error-messages';
import { OnChange, OnTouch } from '@shared/types/control-value-ancessor';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmIconComponent } from '../ui-icon-helm/src';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmInputDirective,
    HlmLabelDirective,
    HlmIconComponent,
  ],
  template: `
    <label hlmLabel>
      {{ label }}
      <input
        hlmInput
        [error]="control.invalid && control.touched"
        ngDefaultControl
        class="w-full"
        [ngClass]="{ 'pl-11': icon }"
        [placeholder]="placeholder"
        [type]="type"
        [accept]="accept"
        (change)="onChange($event)"
        [min]="dateRange && dateRange[0]"
        [max]="dateRange && dateRange[1]"
      />
    </label>
    @if (control.invalid && control.touched) {
      <p class="text-xs text-destructive">{{ getMessage() }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() placeholder?: string;
  @Input() icon?: boolean = false;
  @Input() accept?: string = '';
  @Input() dateRange?: [string, string];

  @ViewChild(DefaultValueAccessor, { static: true }) dva!: DefaultValueAccessor;

  constructor(@Self() public control: NgControl) {
    this.control.valueAccessor = this;
  }

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value: unknown = input.value;
    if (this.type === 'file' && input.files) {
      value = input.files[0];
    }
    this.dva.onChange(value);
  }

  getMessage(): string | undefined {
    const errors = this.control.errors;

    if (!errors) return;

    const firstErrorName = Object.keys(errors)[0];

    return getValidationErrorMessage(firstErrorName);
  }

  setDisabledState(d: boolean): void {
    this.dva.setDisabledState(d);
  }

  writeValue(value: string): void {
    if (this.type !== 'file') {
      this.dva.writeValue(value);
    }
  }

  registerOnChange(fn: OnChange<string>): void {
    this.dva.registerOnChange(fn);
  }

  registerOnTouched(fn: OnTouch): void {
    this.dva.registerOnTouched(fn);
  }
}
