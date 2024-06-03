import { Component } from '@angular/core';
import { ProductListComponent } from '@app/shared/ui/product-list/product-list.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductListComponent],
  template: `<app-product-list></app-product-list>`,
})
export class ShopComponent {}
