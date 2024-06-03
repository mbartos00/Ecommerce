import { Component } from '@angular/core';
import { FooterComponent } from '@app/shared/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
