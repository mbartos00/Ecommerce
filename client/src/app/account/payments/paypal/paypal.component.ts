import { Component, OnInit, inject } from '@angular/core';
import { PaymentsService } from '../payments.service';
import { Observable, map } from 'rxjs';
import { PaymentType } from '@app/shared/types/payments.model';
import { removeNullishProperties } from '@app/shared/utils/utils';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HlmSpinnerComponent } from '@app/shared/ui/ui-spinner-helm/src';

@Component({
  selector: 'app-paypal',
  standalone: true,
  templateUrl: './paypal.component.html',
  imports: [CommonModule, RouterModule, HlmSpinnerComponent],
})
export class PaypalComponent implements OnInit {
  paypals$!: Observable<Partial<PaymentType>[]>;
  private paymentsService = inject(PaymentsService);

  ngOnInit(): void {
    this.paypals$ = this.paymentsService.paymentMethods$.pipe(
      map(paymentMethod =>
        paymentMethod
          .filter(method => method.type === 'paypal')
          .map(item => removeNullishProperties(item))
      )
    );
  }
}
