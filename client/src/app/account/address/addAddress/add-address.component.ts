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
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddressService } from '../address.service';

@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    HlmButtonDirective,
  ],
  providers: [AddressService],
  templateUrl: './add-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAddressComponent implements OnInit {
  addressForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), nameValidator]],
      lastName: [
        '',
        [Validators.required, Validators.minLength(3), nameValidator],
      ],
      country: ['', [Validators.required, Validators.minLength(2)]],
      street_address: ['', [Validators.required, Validators.minLength(2)]],
      street_address_2: [''],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state_province_region: [
        '',
        [Validators.required, Validators.minLength(2)],
      ],
      zip_code: ['', [Validators.required, zipCodeValidation]],
      phone_number: ['', [Validators.required, phoneValidator]],
    });
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      const formData = this.addressForm.value;

      this.addressService
        .addAddress(formData)
        .pipe(
          tap(() => {
            toast.success('Address added successfully');
            this.addressForm.reset();
            this.router.navigate(['/account/address']);
          }),
          catchError(error => {
            toast.error(error.error.message);
            return throwError(() => new Error('Failed to add address'));
          })
        )
        .subscribe();
    }
  }
}
