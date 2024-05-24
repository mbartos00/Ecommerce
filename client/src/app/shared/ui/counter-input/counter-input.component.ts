import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-counter-input',
  standalone: true,
  imports: [],
  templateUrl: './counter-input.component.html',
})
export class CounterInputComponent {
  @Input() min: number = 0;
  @Input() max: number = 10;

  value: number = this.min;

  increment(): void {
    if (this.value < this.max) {
      this.value++;
    }
  }

  decrement(): void {
    if (this.value > this.min) {
      this.value--;
    }
  }

  validateValue(): void {
    if (this.value < this.min) {
      this.value = this.min;
    } else if (this.value > this.max) {
      this.value = this.max;
    }
  }
}
