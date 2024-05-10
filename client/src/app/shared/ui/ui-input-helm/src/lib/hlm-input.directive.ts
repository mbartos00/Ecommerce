import { Directive, Input, computed, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const inputVariants = cva(
  'flex outline-none rounded-md border font-normal border-input bg-transparent text-sm focus-visible:border-primary file:border-0 file:text-foreground file:bg-transparent file:text-sm file:font-medium placeholder:font-thin placeholder:text-xs placeholder:tracking-wider placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-7 px-3 text-sm',
        lg: 'h-10 p-6',
      },
      error: {
        auto: '[&.ng-invalid.ng-touched]:text-destructive [&.ng-invalid.ng-touched]:border-destructive',
        true: 'text-destructive border-destructive',
      },
    },
    defaultVariants: {
      size: 'default',
      error: 'auto',
    },
  }
);
type InputVariants = VariantProps<typeof inputVariants>;

@Directive({
  selector: '[hlmInput]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmInputDirective {
  private readonly _size = signal<InputVariants['size']>('default');
  @Input()
  set size(value: InputVariants['size']) {
    this._size.set(value);
  }

  private readonly _error = signal<InputVariants['error']>('auto');
  @Input()
  set error(value: InputVariants['error']) {
    this._error.set(value);
  }

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected _computedClass = computed(() =>
    hlm(
      inputVariants({ size: this._size(), error: this._error() }),
      this.userClass()
    )
  );
}
