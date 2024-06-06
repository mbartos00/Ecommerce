import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-counter-input',
  standalone: true,
  imports: [],
  templateUrl: './counter-input.component.html',
})
export class CounterInputComponent implements OnInit {
  @Input() min: number = 0;
  @Input() max: number = 10;
  @Input() currentValue: number = 1;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  value: number = this.min;

  ngOnInit(): void {
    this.value = this.currentValue;
  }

  increment(): void {
    if (this.value < this.max) {
      this.value++;
      this.valueChange.emit(this.value);
    }
  }

  decrement(): void {
    if (this.value > this.min) {
      this.value--;
      this.valueChange.emit(this.value);
    }
  }

  validateValue(): void {
    if (this.value < this.min) {
      this.value = this.min;
    } else if (this.value > this.max) {
      this.value = this.max;
    }

    this.valueChange.emit(this.value);
  }
}
