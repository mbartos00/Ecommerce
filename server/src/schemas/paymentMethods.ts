import { z } from 'zod';

const cardNumber = z
  .string()
  .regex(/^\d{16}$/, 'Card number must be 16 digits');
const securityCode = z
  .string()
  .regex(/^\d{3,4}$/, 'Security code must be 3 or 4 digits');
const cardHolder = z.string().min(1, 'Holder name is required');
const expirationDate = z
  .string()
  .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format');

const email = z.string().min(6).email().optional();
const phoneNumber = z
  .string()
  .regex(/^\d{9}$/, 'Phone number must be 9 digits')
  .optional();

const streetName = z
  .string()
  .min(1, 'Street name must not be empty')
  .optional();
const city = z.string().min(1, 'City must not be empty');
const zipCode = z
  .string()
  .regex(/^\d{5}$/, 'Zip code must be a 5-digit number');

const addressSchema = z.object({
  streetName,
  city,
  zipCode,
});

const bankName = z.string().min(1, 'Bank name is required');
const firstName = z.string().min(1, 'Bank name is required');
const lastName = z.string().min(1, 'Bank name is required');
const accountNumber = z
  .string()
  .regex(/^\d{26}$/, 'Account number must be 26 digits');

export const cardPaymentSchema = z.object({
  type: z.literal('credit_card'),
  cardNumber,
  expirationDate,
  securityCode,
  cardHolder,
});

export const paypalPaymentSchema = z
  .object({ email, phoneNumber, type: z.literal('paypal') })
  .refine((data) => data.email || data.phoneNumber, {
    message: 'At least one of email or phone number must be provided',
    path: ['email', 'phoneNumber'],
  });

export const bankTransferSchema = z.object({
  type: z.literal('bank_transfer'),
  bankName,
  firstName,
  lastName,
  accountNumber,
  addressSchema,
});

export const deleteMethodSchema = z.object({
  id: z.string().length(24),
});

export const cardUpdateSchema = z
  .object({
    id: z.string().length(24),
    type: z.literal('credit_card'),
    cardNumber: cardNumber.optional(),
    expirationDate: expirationDate.optional(),
    securityCode: securityCode.optional(),
    cardHolder: cardHolder.optional(),
  })
  .refine((data) => Object.keys(data).length > 2, {
    path: ['cardNumber', 'expirationDate', 'securityCode', 'cardHolder'],
    message: 'At least one field must be provided for update',
  });

export const paypalUpdateSchema = z
  .object({
    id: z.string().length(24),
    type: z.literal('paypal'),
    email: email.optional(),
    phoneNumber: phoneNumber.optional(),
  })
  .refine((data) => Object.keys(data).length > 2, {
    path: ['email', 'phoneNumber'],
    message: 'At least one field must be provided for update',
  });

export const bankUpdateSchema = z
  .object({
    id: z.string().length(24),
    type: z.literal('bank_transfer'),
    firstName: firstName.optional(),
    lastName: lastName.optional(),
    accountNumber: accountNumber.optional(),
    bankName: bankName.optional(),
    address: addressSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 2, {
    path: ['firstName', 'lastName', 'accountNumber', 'bankName', 'address'],
    message: 'At least one field must be provided for update',
  });

export type CardSchema = z.infer<typeof cardPaymentSchema>;
export type PaypalSchema = z.infer<typeof paypalPaymentSchema>;
export type BankTransferSchema = z.infer<typeof bankTransferSchema>;
