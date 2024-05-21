import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from './product.service';
@Injectable({ providedIn: 'root' })
export class ProductResolver {
  constructor(private productService: ProductService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<string | null> {
    const productId = route.params['id'];

    return this.productService
      .getProductById(productId)
      .pipe(map(product => (product ? product.name : null)));
  }
}
