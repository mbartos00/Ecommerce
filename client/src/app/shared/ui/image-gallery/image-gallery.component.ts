import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [HlmIconComponent],
  providers: [
    provideIcons({
      lucideChevronRight,
      lucideChevronLeft,
    }),
  ],
  templateUrl: './image-gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGalleryComponent implements OnInit {
  @Input() images: string[] = [];
  currentImageIndex: number = 0;
  currentImage: string = '';

  ngOnInit(): void {
    this.currentImage = this.images[this.currentImageIndex];
  }

  changeImage(imageUrl: string): void {
    this.currentImageIndex = this.images.indexOf(imageUrl);
    this.currentImage = imageUrl;
  }

  changeImageNext(): void {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.currentImage = this.images[this.currentImageIndex];
    }
  }

  changeImagePrev(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentImage = this.images[this.currentImageIndex];
    }
  }
}
