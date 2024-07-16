import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCreditCard, lucideLandmark } from '@ng-icons/lucide';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaymentTypesEnum } from '@app/shared/types/payments.model';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, HlmIconComponent, RouterModule],
  providers: [
    provideIcons({
      bankTransfer: lucideLandmark,
      creditCard: lucideCreditCard,
    }),
  ],
  templateUrl: './payments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      @apply container lg:flex lg:justify-center;
    }
  `,
})
export class PaymentsComponent {
  paymentTypes: PaymentTypesEnum[] = Object.values(PaymentTypesEnum);
}
