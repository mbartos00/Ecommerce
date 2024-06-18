export const validationErrorMessages = {
  required: 'Required',
  minlength: 'Input is to short',
  maxlength: 'Input is too long',
  email: 'Invalid email',
  passwordMismatch: 'Password do not match',
  pattern: 'Invalid Pattern',
  specialCharacters: 'Special characters are not allowed',
  invalidPassword: 'Password requires 1 special character, and 1 number',
  invalidPhoneNumber: 'Invalid phone number',
  invalidGender: 'Pick one of provided genders',
  invalidAvatar: 'Invalid avatar, accepted file extenstions: .png, .jpg, .jpeg',
  dateInvalidFormat: 'Date must be in YYYY-MM-DD format',
  yearOutOfRange: 'Date must be between 1920 and current year',
  dateInvalid: 'Please provide correct date',
} as const;

type ErrorNames = keyof typeof validationErrorMessages;

export function getValidationErrorMessage(errorName: string): string {
  if (
    Object.prototype.hasOwnProperty.call(validationErrorMessages, errorName)
  ) {
    return validationErrorMessages[errorName as ErrorNames];
  }

  return 'Invalid';
}
