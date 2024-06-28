import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ui-select',
  standalone: true,
  imports: [],
  templateUrl: './ui-select.component.html',
})
export class SelectComponent {
  @Input() selectId: string = 'select-id';
  @Input() selectName: string = 'select-name';
  @Input() values: string[] = [];
  @Input() selectedValue: string = '';
  @Input() withIcon = false;
  @Output() selectedValueChange: EventEmitter<string> =
    new EventEmitter<string>();

  onValueChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedValueChange.emit(selectElement.value);
  }
}
