import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnTabsContentDirective } from '@spartan-ng/ui-tabs-brain';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmTabsContent]',
  standalone: true,
  hostDirectives: [
    {
      directive: BrnTabsContentDirective,
      inputs: ['brnTabsContent: hlmTabsContent'],
    },
  ],
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmTabsContentDirective {
  public readonly contentFor = input.required<string>({
    alias: 'hlmTabsContent',
  });

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected _computedClass = computed(() =>
    hlm(
      'p-5 bg-grey-light text-grey-neutral text-xs sm:text-base font-light ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      this.userClass()
    )
  );
}
