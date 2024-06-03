import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { INFO_SECTION } from '../constants';

export interface InfoSection {
  img: string;
  alt: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-info-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-section.component.html',
})
export class InfoSectionComponent {
  infoSection: InfoSection[] = INFO_SECTION;
}
