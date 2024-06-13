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
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { getValidationErrorMessage } from '@app/shared/utils/error-messages';
import { OnChange, OnTouch } from '@shared/types/control-value-ancessor';
import { HlmIconComponent } from '../ui-icon-helm/src';
@Component({
  selector: 'app-form-textarea',
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
      <textarea
        hlmInput
        [error]="control.invalid && control.touched"
        ngDefaultControl
        class="w-full h-48"
        [ngClass]="{ 'pl-11': icon }"
        [placeholder]="placeholder"
      ></textarea>
    </label>

    <p
      *ngIf="control.invalid && control.touched"
      class="text-xs text-destructive"
    >
      {{ getMessage() }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormTextareaComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() placeholder?: string;
  @Input() icon?: boolean = false;
  @Input() textarea?: boolean = false;
  @ViewChild(DefaultValueAccessor, { static: true }) dva!: DefaultValueAccessor;
  constructor(@Self() public control: NgControl) {
    this.control.valueAccessor = this;
  }
  getMessage() {
    const errors = this.control.errors;
    if (!errors) return;
    const firstErrorName = Object.keys(errors)[0];
    return getValidationErrorMessage(firstErrorName);
  }
  setDisabledState(d: boolean) {
    this.dva.setDisabledState(d);
  }
  writeValue(value: string) {
    this.dva.writeValue(value);
  }
  registerOnChange(fn: OnChange<string>) {
    this.dva.registerOnChange(fn);
  }
  registerOnTouched(fn: OnTouch) {
    this.dva.registerOnTouched(fn);
  }
}
