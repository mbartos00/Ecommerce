import { BehaviorSubject, filter } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Breadcrumb } from './breadcrumbs.model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbsSubject$ = new BehaviorSubject<Breadcrumb[]>([]);

  breadcrumbs$ = this.breadcrumbsSubject$.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.generateBreadcrumbs())
      )
      .subscribe(breadcrumbs => this.updateBreadcrumbs(breadcrumbs));
  }

  private generateBreadcrumbs(): Breadcrumb[] {
    const root = this.router.routerState.snapshot.root;
    return this.createBreadcrumbs(root);
  }

  private createBreadcrumbs(
    route: ActivatedRouteSnapshot | null,
    parentUrl: string[] = []
  ): Breadcrumb[] {
    if (!route) {
      return [];
    }

    const routeUrl = [...parentUrl, ...route.url.map(url => url.path)];
    const breadcrumbs: Breadcrumb[] = [];

    if (route.data && route.data['breadcrumb']) {
      const breadcrumb: Breadcrumb = {
        label: route.data['breadcrumb'],
        url: '/' + routeUrl.join('/'),
      };
      breadcrumbs.push(breadcrumb);
    }

    return breadcrumbs.concat(
      this.createBreadcrumbs(route.firstChild, routeUrl)
    );
  }

  private updateBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.breadcrumbsSubject$.next(breadcrumbs);
  }
}
