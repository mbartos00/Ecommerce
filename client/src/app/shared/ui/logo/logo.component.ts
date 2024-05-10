import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  template: `
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M30.8284 13.1716C32.3905 14.7337 32.3905 17.2663 30.8284 18.8284L18.8284 30.8284C17.2663 32.3905 14.7337 32.3905 13.1716 30.8284L1.17157 18.8284C-0.390523 17.2663 -0.390523 14.7337 1.17157 13.1716L13.1716 1.17157C14.7337 -0.390525 17.2663 -0.390525 18.8284 1.17157L30.8284 13.1716ZM16 9.65685L9.65686 16L16 22.3431L22.3431 16L16 9.65685Z"
        fill="white"
      />
    </svg>
  `,
  styles: `
    :host {
      @apply w-20 aspect-square bg-primary rounded-2xl flex justify-center items-center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {}
