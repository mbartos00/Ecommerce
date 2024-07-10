import { Pipe, PipeTransform } from '@angular/core';
import { PaymentTypeKey, PaymentTypes } from '../types/payment';

@Pipe({
  name: 'paymentType',
  standalone: true,
})
export class PaymentTypePipe implements PipeTransform {
  transform(value: PaymentTypeKey): string {
    return PaymentTypes[value];
  }
}
