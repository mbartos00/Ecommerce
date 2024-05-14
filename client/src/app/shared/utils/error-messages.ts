export const validationErrorMessages = {
  required: 'Required',
  minlength: 'Input is to short',
  maxlength: 'Input is too long',
  email: 'Invalid email',
  passwordMismatch: 'Password do not match',
  pattern: 'Invalid Pattern',
  specialCharacters: 'Special characters are not allowed',
  invalidPassword: 'Password requires 1 special character, and 1 number',
} as const;

type ErrorNames = keyof typeof validationErrorMessages;

export function getValidationErrorMessage(errorName: string): string {
  if (validationErrorMessages.hasOwnProperty(errorName)) {
    return validationErrorMessages[errorName as ErrorNames];
  }

  return 'Invalid';
}
