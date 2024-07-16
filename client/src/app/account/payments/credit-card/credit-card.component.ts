import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaymentType } from '@app/shared/types/payments.model';
import { HlmSpinnerComponent } from '@app/shared/ui/ui-spinner-helm/src';
import { removeNullishProperties } from '@app/shared/utils/utils';
import { Observable, map } from 'rxjs';
import { PaymentsService } from '../payments.service';
import { UiCreditCardComponent } from './ui/card.component';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  templateUrl: './credit-card.component.html',
  imports: [
    CommonModule,
    RouterModule,
    UiCreditCardComponent,
    HlmSpinnerComponent,
  ],
})
export class CreditCardComponent implements OnInit {
  creditCards$!: Observable<Partial<PaymentType>[]>;
  private paymentsService = inject(PaymentsService);

  ngOnInit(): void {
    this.creditCards$ = this.paymentsService.paymentMethods$.pipe(
      map(paymentMethod => {
        return paymentMethod
          .filter(method => method.type === 'credit_card')
          .map(item => removeNullishProperties(item));
      })
    );
  }
}
