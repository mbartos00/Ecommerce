import { Element } from '@angular/compiler';
import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostListener,
  inject,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() public clickOutside = new EventEmitter();
  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: Element): void {
    const isClickedInside =
      this.elementRef.nativeElement.contains(targetElement);

    if (!isClickedInside) {
      this.clickOutside.emit(null);
    }
  }
}
