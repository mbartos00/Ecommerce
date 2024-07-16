import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import {
  nameValidator,
  phoneValidator,
  zipCodeValidation,
} from '@app/auth/signup/utils/validators';
import { HlmButtonDirective } from '@app/shared/ui/ui-button-helm/src';
import { toast } from 'ngx-sonner';
import { catchError, tap, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddressService } from '../address.service';
import { Observable } from 'rxjs';
import { Address } from '@app/shared/types/address';

@Component({
  selector: 'app-edit-address',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    HlmButtonDirective,
  ],
  providers: [AddressService],
  templateUrl: './edit-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAddressComponent implements OnInit {
  addressForm!: FormGroup;
  addressId!: string;
  address$!: Observable<Address>;

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.addressId = this.route.snapshot.paramMap.get('id')!;
    this.address$ = this.addressService.getAddress(this.addressId);

    this.addressForm = this.fb.group({
      name: ['', [Validators.minLength(3), nameValidator]],
      lastName: ['', [Validators.minLength(3), nameValidator]],
      country: ['', [Validators.minLength(2)]],
      street_address: ['', [Validators.minLength(2)]],
      street_address_2: [''],
      city: ['', [Validators.minLength(2)]],
      state_province_region: ['', [Validators.minLength(2)]],
      zip_code: ['', [zipCodeValidation]],
      phone_number: ['', [phoneValidator]],
    });
  }

  onSubmit(): void {
    const formData = this.addressForm.value;

    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        delete formData[key];
      }
    });

    if (Object.keys(formData).length === 0) {
      toast.error('At least one field must be provided for update');
      return;
    }

    this.addressService
      .updateAddress(formData, this.addressId)
      .pipe(
        tap(() => {
          toast.success('Address updated successfully');
          this.router.navigate(['/account/address']);
        }),
        catchError(error => {
          toast.error(error.message);
          return throwError(() => new Error('Failed to add address'));
        })
      )
      .subscribe();
  }
}
