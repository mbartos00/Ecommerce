import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Favorites } from '@app/shared/types/user';
import { ProductCardComponent } from '@app/shared/ui/product-card/product-card.component';
import { Observable } from 'rxjs';
import { FavoriteService } from './favorite.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './favorite.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteComponent implements OnInit {
  favorites$: Observable<Favorites> = new Observable<Favorites>();

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.favorites$ = this.favoriteService.favoriteList$;
  }
}
