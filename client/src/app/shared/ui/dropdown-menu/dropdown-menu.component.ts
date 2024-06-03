import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QueryParamClassDirective } from '@app/shared/directives/queryParamsClass.directive';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [RouterModule, QueryParamClassDirective],
  templateUrl: './dropdown-menu.component.html',
})
export class DropdownMenuComponent {
  @Input() menuItems: string[] = [];
  @Input() hrefUrl: string = '';

  isOpen = false;

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  showDropdown(): void {
    this.isOpen = true;
  }

  hideDropdown(): void {
    this.isOpen = false;
  }
}
