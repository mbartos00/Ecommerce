import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaymentType } from '@app/shared/types/payments.model';
import { HlmSpinnerComponent } from '@app/shared/ui/ui-spinner-helm/src';
import { removeNullishProperties } from '@app/shared/utils/utils';
import { Observable, map } from 'rxjs';
import { PaymentsService } from '../payments.service';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  templateUrl: './bank-transfer.component.html',
  imports: [CommonModule, RouterModule, HlmSpinnerComponent],
})
export class BankTransferComponent implements OnInit {
  bankTransfers$!: Observable<Partial<PaymentType>[]>;
  private paymentsService = inject(PaymentsService);

  ngOnInit(): void {
    this.bankTransfers$ = this.paymentsService.paymentMethods$.pipe(
      map(paymentMethod => {
        return paymentMethod
          .filter(method => method.type === 'bank_transfer')
          .map(item => removeNullishProperties(item));
      })
    );
  }

  formatAccountNumber(input: string): string {
    return input.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }
}
