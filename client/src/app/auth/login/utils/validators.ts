import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PASSWORD_REGEX } from '@app/shared/utils/regex';

export const passwordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!PASSWORD_REGEX.test(control.value)) {
    return { invalidPassword: true };
  }

  return null;
};
