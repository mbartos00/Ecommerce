import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Breadcrumb } from './breadcrumbs.model';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BreadcrumbService } from './breadcrumbs.service';
import { lucideChevronLeft } from '@ng-icons/lucide';
import { provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [RouterModule, CommonModule, HlmIconComponent],
  providers: [provideIcons({ lucideChevronLeft })],
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent {
  breadcrumbs$: Observable<Breadcrumb[]> = this.breadcrumbService.breadcrumbs$;

  constructor(private readonly breadcrumbService: BreadcrumbService) {}
}
