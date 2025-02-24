import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ProductCardComponent } from '@app/shared/ui/product-card/product-card.component';
import { map, Observable } from 'rxjs';
import { FavoriteService } from './favorite.service';
import { Product } from '@app/shared/types/product.model';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './favorite.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteComponent implements OnInit {
  favorites$: Observable<Product[]> = new Observable<Product[]>();

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.favorites$ = this.favoriteService.favoriteList$.pipe(
      map(favList => favList.products)
    );
  }
}
