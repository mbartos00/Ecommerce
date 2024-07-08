import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { News } from '../types/news.model';
import { NewsService } from './data-access/news.service';
import { TruncatePipe } from '../pipes/truncate.pipe';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterModule, TruncatePipe],
  templateUrl: './latest-news.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestNewsComponent implements OnInit {
  news$: Observable<News[]> = new Observable<News[]>();
  private newsService = inject(NewsService);

  ngOnInit(): void {
    this.news$ = this.newsService.getLatestNews();
  }
}
