import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
@Component({
  selector: 'app-root',
  standalone: true,
  template: `<router-outlet><app-header></app-header></router-outlet>`,
  imports: [RouterOutlet, HeaderComponent],
})
export class AppComponent {}
