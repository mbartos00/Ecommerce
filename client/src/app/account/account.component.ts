import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import { HlmInputDirective } from '@app/shared/ui/ui-input-helm/src';
import { HlmBadgeDirective } from '@app/shared/ui/ui-badge-helm/src';
import { ReactiveFormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideSearch,
  lucideShoppingCart,
  lucideUser,
  lucideMapPin,
  lucideShoppingBag,
  lucideCreditCard,
} from '@ng-icons/lucide';
import { ProfileListItemComponent } from '@app/shared/ui/profile-list-item/profile-list-item.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HlmIconComponent,
    HlmInputDirective,
    HlmBadgeDirective,
    ReactiveFormsModule,
    ProfileListItemComponent,
  ],
  providers: [
    provideIcons({
      lucideUser,
      lucideShoppingCart,
      lucideSearch,
      lucideChevronDown,
      lucideMapPin,
      lucideShoppingBag,
      lucideCreditCard,
    }),
  ],
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {}
