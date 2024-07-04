import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import { lucideChevronRight } from '@ng-icons/lucide';

@Component({
  selector: 'app-profile-list-item',
  templateUrl: './profile-list-item.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, HlmIconComponent],
  providers: [
    provideIcons({
      lucideChevronRight,
    }),
  ],
})
export class ProfileListItemComponent {
  @Input() icon!: string;
  @Input() label!: string;
  @Input() value!: string | Date | null;
  @Input() link?: string;
  @Input() profileInfo: boolean = false;
}
