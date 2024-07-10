import { Component, OnInit } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { News } from '../types/news.model';
import { NewsService } from './data-access/news.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-details',
  standalone: true,
  templateUrl: './news-details.component.html',
  imports: [CommonModule],
})
export class NewsDetailsComponent implements OnInit {
  news$: Observable<News> = new Observable<News>();

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.news$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(newsId => this.newsService.getNewsById(newsId))
    );
  }
}
