import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
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
