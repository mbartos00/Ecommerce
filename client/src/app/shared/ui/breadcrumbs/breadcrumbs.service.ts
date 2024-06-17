import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Breadcrumb } from './breadcrumbs.model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbsSubject$ = new BehaviorSubject<Breadcrumb[]>([]);
  //eslint-disable-next-line
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
    parentUrl: string[] = [],
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    if (!route) {
      return breadcrumbs;
    }

    const routeUrl = [...parentUrl, ...route.url.map(url => url.path)];
    const breadcrumbUrl = '/' + routeUrl.join('/');

    if (route.data && route.data['breadcrumb']) {
      let label = route.data['breadcrumb'];

      if (route.params && Object.keys(route.params).length) {
        for (const key of Object.keys(route.params)) {
          label = label.replace(`:${key}`, route.params[key]);
        }
      }

      const breadcrumb: Breadcrumb = {
        label: label,
        url: breadcrumbUrl,
      };
      breadcrumbs.push(breadcrumb);
    }

    return this.createBreadcrumbs(
      route.firstChild,
      routeUrl,
      this.getDistinctBreadcrumbs(breadcrumbs)
    );
  }

  private updateBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.breadcrumbsSubject$.next(breadcrumbs);
  }

  private getDistinctBreadcrumbs(breadcrumbs: Breadcrumb[]): Breadcrumb[] {
    const seen = new Set();
    return breadcrumbs.filter(breadcrumb => {
      const duplicate = seen.has(breadcrumb.label + breadcrumb.url);
      seen.add(breadcrumb.label + breadcrumb.url);
      return !duplicate;
    });
  }
}
