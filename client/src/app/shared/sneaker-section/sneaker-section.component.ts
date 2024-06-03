import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sneaker-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sneaker-section.component.html',
})
export class SneakerSectionComponent {}
