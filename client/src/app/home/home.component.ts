import { Component } from '@angular/core';
import { FeaturedComponent } from '@app/shared/featured/featured.component';
import { FooterComponent } from '@app/shared/footer/footer.component';
import { InfoSectionComponent } from '@app/shared/info-section/info-section.component';
import { SneakerSectionComponent } from '@app/shared/sneaker-section/sneaker-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent,
    FeaturedComponent,
    SneakerSectionComponent,
    InfoSectionComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
