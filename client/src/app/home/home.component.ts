import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeaturedComponent } from '@app/shared/featured/featured.component';
import { FooterComponent } from '@app/shared/footer/footer.component';
import { SalesComponent } from './sales/sales.component';
import { SneakerSectionComponent } from '@app/shared/sneaker-section/sneaker-section.component';
import { InfoSectionComponent } from '@app/shared/info-section/info-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SalesComponent,
    SneakerSectionComponent,
    InfoSectionComponent,
    FooterComponent,
    FeaturedComponent,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
