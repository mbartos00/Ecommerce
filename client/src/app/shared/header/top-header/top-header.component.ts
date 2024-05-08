import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideSearch,
  lucideShoppingCart,
  lucideUser,
} from '@ng-icons/lucide';
import { BrnDialogContext } from '@spartan-ng/ui-dialog-brain';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

type DialogContext = {
  close: (result?: unknown) => void;
};

@Component({
  selector: 'app-top-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HlmIconComponent,
    HlmInputDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './top-header.component.html',
  providers: [
    provideIcons({
      lucideUser,
      lucideShoppingCart,
      lucideSearch,
      lucideChevronDown,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopHeaderComponent {
  @Input() hamburgerMenuSheetCtx!: BrnDialogContext<DialogContext>;
  searchbar = new FormControl('');
  router = inject(Router);
  isSearchbarOpen = false;

  toggleSearchbarOpen(): void {
    this.isSearchbarOpen = !this.isSearchbarOpen;
  }

  searchProducts(e: Event): void {
    e.preventDefault();

    if (this.searchbar.value?.length === 0) {
      return;
    }

    this.toggleSearchbarOpen();
    this.hamburgerMenuSheetCtx.close();

    this.router.navigate(['/products'], {
      queryParams: { search: this.searchbar.value },
    });
  }
}
