import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import { provideIcons } from '@ng-icons/core';
import { lucideCreditCard } from '@ng-icons/lucide';

@Component({
  selector: 'app-ui-credit-card',
  templateUrl: 'card.component.html',
  standalone: true,
  imports: [HlmIconComponent, RouterModule],
  providers: [provideIcons({ lucideCreditCard })],
})
export class UiCreditCardComponent {
  @Input() cardNumber!: string;
  @Input() expiration!: string;
  @Input() cardHolder!: string;
  @Input() cardId!: string;

  formatCardNumber(input: string): string {
    return input.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }
}
