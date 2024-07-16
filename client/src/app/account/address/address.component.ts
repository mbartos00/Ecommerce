import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { HlmButtonDirective } from '@app/shared/ui/ui-button-helm/src';
import { HlmIconComponent } from '@app/shared/ui/ui-icon-helm/src';
import { provideIcons } from '@ng-icons/core';
import { lucideTrash } from '@ng-icons/lucide';
import { AddressService } from './address.service';
import { Observable } from 'rxjs';
import { Address } from '@app/shared/types/address';
import { catchError, tap, throwError } from 'rxjs';
import {
  BrnAlertDialogContentDirective,
  BrnAlertDialogTriggerDirective,
} from '@spartan-ng/ui-alertdialog-brain';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective,
} from '@spartan-ng/ui-alertdialog-helm';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HlmButtonDirective,
    HlmIconComponent,
    BrnAlertDialogTriggerDirective,
    BrnAlertDialogContentDirective,

    HlmAlertDialogComponent,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogContentComponent,
  ],
  providers: [
    AddressService,
    provideIcons({
      lucideTrash,
    }),
  ],
  templateUrl: './address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
  addresses$: Observable<Address[]> = this.addressService.getAddresses();

  constructor(private addressService: AddressService) {}

  loadAddresses(): void {
    this.addresses$ = this.addressService.getAddresses();
  }

  deleteAddress(addressId: string): void {
    this.addressService
      .deleteAddress(addressId)
      .pipe(
        tap(() => {
          toast.success('Address deleted successfully');
          this.loadAddresses();
          location.reload();
        }),
        catchError(error => {
          toast.error(error.message);
          return throwError(() => new Error('Failed to delete address'));
        })
      )
      .subscribe();
  }
}
