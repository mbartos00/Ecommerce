import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { BreadcrumbsComponent } from '../ui/breadcrumbs/breadcrumbs.component';
import { DropdownMenuComponent } from '../ui/dropdown-menu/dropdown-menu.component';
import { Category } from '../types/product.model';
import { CategoryService } from '../data-access/category.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HlmIconComponent,
    RouterModule,
    CommonModule,
    HamburgerMenuComponent,
    TopHeaderComponent,
    BreadcrumbsComponent,
    DropdownMenuComponent,
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
export class HeaderComponent {
  categories$ = this.categoryService
    .getCategories()
    .pipe(
      map(data =>
        data.map(category => category.name).sort((a, b) => a.localeCompare(b))
      )
    );

  constructor(private categoryService: CategoryService) {}
}
