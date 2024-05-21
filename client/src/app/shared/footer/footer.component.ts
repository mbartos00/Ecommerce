import { Component } from '@angular/core';
import { HlmButtonDirective } from '../ui/ui-button-helm/src';
import { CommonModule } from '@angular/common';
import { HlmIconComponent } from '../ui/ui-icon-helm/src';
import { provideIcons } from '@ng-icons/core';
import { lucideTwitter, lucideFacebook } from '@ng-icons/lucide';
import { LogoComponent } from '../ui/logo/logo.component';
import { FOOTER_SECTIONS } from '../constants';

interface PaymentImg {
  url: string;
  alt: string;
}

interface Link {
  title: string;
  url: string;
}

export interface FooterSection {
  title: string;
  links: Link[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [HlmButtonDirective, CommonModule, HlmIconComponent, LogoComponent],
  providers: [provideIcons({ lucideTwitter, lucideFacebook })],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  footerSections: FooterSection[] = FOOTER_SECTIONS;

  paymentImg: PaymentImg[] = [
    { url: '../../../assets/western-union.png', alt: 'Western Union' },
    { url: '../../../assets/card-mastercard.png', alt: 'MasterCard' },
    { url: '../../../assets/paypal.png', alt: 'PayPal' },
    { url: '../../../assets/card-visa.png', alt: 'Visa Card' },
  ];
}
