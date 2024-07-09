import { Component } from '@angular/core';
import { HlmSkeletonComponent } from '../ui-skeleton-helm/src/lib/hlm-skeleton.component';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [HlmSkeletonComponent],
  template: ` <div
    class="flex max-w-[240px] flex-col items-center p-4 m-4 w-fit space-x-4 space-y-4 rounded-md bg-white shadow-md transition-shadow duration-300 cursor-pointer hover:shadow-2xl hover:shadow-gray-dark"
  >
    <hlm-skeleton class="w-40 h-40 " />
    <div class="space-y-2">
      <hlm-skeleton class="h-4 w-[200px]" />
      <hlm-skeleton class="h-4 w-[200px]" />
    </div>
  </div>`,
})
export class SkeletonCardComponent {}
