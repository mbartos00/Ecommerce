import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchesValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password && confirmPassword && password === confirmPassword
    ? null
    : { passwordMismatch: true };
};

export const nameValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const nameRegex = /^[a-zA-Z\s]*$/;
  if (!nameRegex.test(control.value)) {
    return { specialCharacters: true };
  }
  return null;
};

export const passwordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]*$/;
  if (!passwordRegex.test(control.value)) {
    return { invalidPassword: true };
  }
  return null;
};

export const phoneValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) {
    return null;
  }

  const phoneRegex = /^\(?\d{3}\)?[- .]?\d{3}[- .]?\d{3}$/;
  if (!phoneRegex.test(control.value)) {
    return { invalidPhoneNumber: true };
  }
  return null;
};

export const creditCardValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const digitsRegex = /^\d+$/;

  if (!control.value) {
    return null;
  }

  if (!digitsRegex.test(control.value)) {
    return { invalidCardNumber: true };
  }

  if (control.value.length !== 16) {
    return { invalidCardNumberLength: true };
  }

  return null;
};

export const securityCodeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const digitsRegex = /^\d+$/;

  if (!control.value) {
    return null;
  }

  if (!digitsRegex.test(control.value)) {
    return { invalidSecurityCode: true };
  }

  if (control.value.length < 3 || control.value.length > 4) {
    return { invalidSecurityCodeLength: true };
  }

  return null;
};

export const expirationDateValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value: string = control.value;

  if (!value) return null;

  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;

  if (!regex.test(value)) {
    return { invalidExpirationDateFormat: true };
  }

  const [month, year] = value.split('/').map(v => parseInt(v, 10));
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (year > currentYear || (year === currentYear && month > currentMonth)) {
    return null;
  }

  return { cardExpired: true };

  return null;
};

export const zipCodeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const zipCodeRegex = /^\d{5}$/;

  if (!control.value) {
    return null;
  }

  if (!zipCodeRegex.test(control.value)) {
    return { invalidZipCode: true };
  }

  return null;
};

export const accountNumberValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const accountNumberRegex = /^\d{26}$/;

  if (!control.value) {
    return null;
  }

  if (!accountNumberRegex.test(control.value)) {
    return { invalidAccountNumber: true };
  }

  return null;
};

export const genderValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const validGenders = ['male', 'female', 'other'];
  if (!validGenders.includes(control.value)) {
    return { invalidGender: true };
  }
  return null;
};

export const avatarValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const validExtensions = ['image/png', 'image/jpeg', 'image/jpg'];

  if (control.value && !validExtensions.includes(control.value.type)) {
    return { invalidAvatar: true };
  }
  return null;
};

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(value)) {
      return { dateInvalidFormat: true };
    }

    const dateParts = value.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);
    const currentYear = new Date().getFullYear();

    if (year < 1920 || year > currentYear) {
      return { yearOutOfRange: true };
    }

    const date = new Date(value);
    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
      return { dateInvalid: true };
    }

    return null;
  };
}

export const zipCodeValidation: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const zipCodeRegex = /^\d{2}-\d{3}$/;
  if (!zipCodeRegex.test(control.value)) {
    return { invalidZipCode: true };
  }
  return null;
};
