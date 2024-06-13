import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import type { ProductList } from '../types/product.model';
import { Observable } from 'rxjs';
import { FeaturedService } from './data-access/featured.service';
import { getStarsArray } from '../utils/utils';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured.component.html',
  providers: [FeaturedService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedComponent implements OnInit {
  products$: Observable<ProductList> = new Observable<ProductList>();
  totalProducts: number = 3;

  constructor(private featuredService: FeaturedService) {}

  ngOnInit(): void {
    this.products$ = this.featuredService.getFeaturedProducts();
  }

  getStarsArray(): number[] {
    return getStarsArray();
  }
}
