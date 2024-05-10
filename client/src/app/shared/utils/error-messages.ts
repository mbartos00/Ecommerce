export const validationErrorMessages = {
  required: 'Required',
  minlength: 'Input is too short',
  maxlength: 'Input is too long',
  email: 'Invalid email',
  passwordMatch: 'Password do not match',
  pattern: 'Invalid Pattern',
  invalidPassword: 'Oops! Your Password Is Not Correct',
} as const;

type ErrorNames = keyof typeof validationErrorMessages;

export function getValidationErrorMessage(errorName: string): string {
  if (validationErrorMessages.hasOwnProperty(errorName)) {
    return validationErrorMessages[errorName as ErrorNames];
  }

  return 'Invalid';
}
