import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnTabsTriggerDirective } from '@spartan-ng/ui-tabs-brain';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmTabsTrigger]',
  standalone: true,
  hostDirectives: [
    {
      directive: BrnTabsTriggerDirective,
      inputs: ['brnTabsTrigger: hlmTabsTrigger', 'disabled'],
    },
  ],
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmTabsTriggerDirective {
  public readonly triggerFor = input.required<string>({
    alias: 'hlmTabsTrigger',
  });

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected _computedClass = computed(() =>
    hlm(
      'inline-flex items-center justify-center rounded-sm px-1.5 sm:px-3 py-1 sm:py-1.5  font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-xs sm:text-sm ',
      this.userClass()
    )
  );
}
