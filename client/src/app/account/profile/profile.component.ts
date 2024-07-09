import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import { HlmInputDirective } from '@app/shared/ui/ui-input-helm/src';
import { HlmBadgeDirective } from '@app/shared/ui/ui-badge-helm/src';
import { ReactiveFormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideMail,
  lucidePhone,
  lucideChevronRight,
  lucideLock,
  lucideCircle,
} from '@ng-icons/lucide';
import { ProfileService } from './profile.service';
import { Profile } from '@app/shared/types/profile';
import { Observable } from 'rxjs';
import { ProfileListItemComponent } from '@app/shared/ui/profile-list-item/profile-list-item.component';

@Component({
  selector: 'app-profile',
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
      lucideCalendar,
      lucideMail,
      lucidePhone,
      lucideChevronRight,
      lucideLock,
      lucideCircle,
    }),
  ],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  profile$: Observable<Profile> = this.profileService.getProfile();

  constructor(private profileService: ProfileService) {}
}
