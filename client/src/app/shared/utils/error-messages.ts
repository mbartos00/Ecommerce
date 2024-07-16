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
  invalidCardNumber: 'Invalid credit card number',
  invalidCardNumberLength: 'Card number should have 16 digits',
  invalidSecurityCode: 'Invalid security code',
  invalidSecurityCodeLength: 'Security code should have 3 or 4 digits',
  cardExpired: 'Card expired',
  invalidExpirationDateFormat: 'Expiration date should have MM/YY format',
  invalidZipCode: 'Zip code must be a 5-digit number',
  invalidAccountNumber: 'Account number must have 26 digits',
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
