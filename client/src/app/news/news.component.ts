import { Component } from '@angular/core';
import { NewsListComponent } from '@app/shared/ui/news-list/news-list.component';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NewsListComponent],
  template: `<app-news-list></app-news-list>`,
})
export class NewsComponent {}
