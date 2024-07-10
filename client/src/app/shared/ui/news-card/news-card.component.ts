import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { News } from '@app/shared/types/news.model';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { TruncatePipe } from '@app/shared/pipes/truncate.pipe';

@Component({
  selector: 'app-news-card',
  standalone: true,
  templateUrl: './news-card.component.html',
  imports: [CommonModule, RouterModule, SkeletonCardComponent, TruncatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsCardComponent {
  @Input() news: News = {} as News;
}
