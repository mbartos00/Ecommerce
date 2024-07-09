import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '@app/shared/cart/cart.service';
import { AuthService } from '@app/shared/data-access/auth.service';
import { UserService } from '@app/shared/data-access/user.service';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideLogOut,
  lucideSearch,
  lucideShoppingCart,
  lucideUser,
  lucideUserCheck,
} from '@ng-icons/lucide';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { BrnDialogContext } from '@spartan-ng/ui-dialog-brain';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { toast } from 'ngx-sonner';
import { Observable, Subscription, map, take } from 'rxjs';

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
    HlmBadgeDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './top-header.component.html',
  providers: [
    provideIcons({
      lucideUser,
      lucideShoppingCart,
      lucideSearch,
      lucideChevronDown,
      lucideUserCheck,
      lucideLogOut,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopHeaderComponent implements OnInit, OnDestroy {
  @Input() hamburgerMenuSheetCtx!: BrnDialogContext<DialogContext>;
  searchbar = new FormControl('');
  router = inject(Router);
  isSearchbarOpen = false;
  cartCount = 0;
  cartTotal = 0;
  isAuthenticated$!: Observable<boolean>;
  private cartService = inject(CartService);
  private subscription$!: Subscription;
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.subscription$ = this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.cartItemsCount;
      this.cartTotal = this.cartService.getTotal();
      this.cd.detectChanges();
    });

    this.isAuthenticated$ = this.userService.user$.pipe(map(d => d.isAuth));
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  toggleSearchbarOpen(): void {
    this.isSearchbarOpen = !this.isSearchbarOpen;
  }

  logout(): void {
    this.authService.logout().pipe(take(1)).subscribe();
    this.router.navigate(['/']).then(() => {
      toast.success('Logged out');
    });
  }

  searchProducts(e: Event): void {
    e.preventDefault();

    if (this.searchbar.value?.length === 0) {
      return;
    }

    this.toggleSearchbarOpen();

    if (this.hamburgerMenuSheetCtx) {
      this.hamburgerMenuSheetCtx.close();
    }

    this.router.navigate(['/shop'], {
      queryParams: { search: this.searchbar.value },
    });
  }
}
