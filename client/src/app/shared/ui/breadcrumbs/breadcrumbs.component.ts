import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Breadcrumb } from './breadcrumbs.model';
import { BreadcrumbService } from './breadcrumbs.service';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent {
  breadcrumbs$: Observable<Breadcrumb[]> = this.breadcrumbService.breadcrumbs$;

  constructor(private readonly breadcrumbService: BreadcrumbService) {}
}
