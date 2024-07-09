import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="h-[80svh] overflow-hidden w-full grid place-items-center font-poppins text-navy"
    >
      <div class="text-center">
        <h1 class="text-6xl lg:text-8xl font-bold">404</h1>
        <h2 class="text-3xl mb-4">Page not found</h2>
        <button
          (click)="goBack()"
          class="font-poppins shadow-md px-6 py-2 rounded-sm text-pink cursor-pointer"
        >
          Go back
        </button>
      </div>
    </div>
  `,
})
export class NotFoundComponent {
  private location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
