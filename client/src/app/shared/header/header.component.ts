import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  lucideContact,
  lucideHome,
  lucideNewspaper,
  lucideShoppingBag,
} from '@ng-icons/lucide';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HamburgerMenuComponent } from '../ui/hamburger-menu/hamburger-menu.component';
import { TopHeaderComponent } from './top-header/top-header.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HlmIconComponent,
    RouterModule,
    CommonModule,
    HamburgerMenuComponent,
    TopHeaderComponent,
  ],
  providers: [
    provideIcons({
      lucideHome,
      lucideNewspaper,
      lucideContact,
      lucideShoppingBag,
    }),
  ],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
