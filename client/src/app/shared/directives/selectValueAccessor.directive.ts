import {
  Directive,
  forwardRef,
  HostListener,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector:
    //eslint-disable-next-line
    'app-ui-select[formControlName], app-ui-select[formControl], app-ui-select[ngModel]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectValueAccessorDirective),
      multi: true,
    },
  ],
})
export class SelectValueAccessorDirective implements ControlValueAccessor {
  private onChange!: (value: string) => void;
  private onTouched!: () => void;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  @HostListener('selectedValueChange', ['$event'])
  handleChange(event: string): void {
    this.onChange(event);
  }

  writeValue(value: string): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'selectedValue',
      value
    );
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'disabled',
      isDisabled
    );
  }
}
