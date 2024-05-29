import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dropdown-menu.component.html',
})
export class DropdownMenuComponent {
  @Input() menuItems: string[] = [];
  @Input() hrefUrl: string = '';

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  showDropdown() {
    this.isOpen = true;
  }

  hideDropdown() {
    this.isOpen = false;
  }
}
