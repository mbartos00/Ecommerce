import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-wrapper',
  standalone: true,
  imports: [],
  template: `
    <div
      class="bg-grey-light w-full px-2 py-6 rounded-sm grid place-items-center lg:place-items-start xl:rounded-none xl:px-5"
    >
      <p class="text-black font-poppins text-lg mb-4">{{ title }}</p>
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterWrapperComponent {
  @Input() title!: string;
}
