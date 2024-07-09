import { z } from 'zod';

export const emailValidation = z.string().min(6).email();
const passwordValidation = z.string().min(6).max(30);
const nameValidation = z.string().min(3).max(30);
const addressPartValidation = z.string().min(2).max(100);
const zipcodeValidation = z
  .string()
  .refine((value) => /^\d{2}-\d{3}$/.test(value));
const phoneValidation = z
  .string()
  .refine((value) => /^\(?\d{3}\)?[- .]?\d{3}[- .]?\d{3}$/.test(value));
export const idValidation = z.string().length(24);

enum Gender {
  male = 'male',
  female = 'female',
  ohter = 'other',
}

export const registerSchema = z.object({
  name: nameValidation,
  lastName: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  gender: z.nativeEnum(Gender),
  birthday: z.string().date('Date should be in YYYY-MM-DD format'),
  phone_number: phoneValidation,
  profile_photo_url: z.string().url().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const updateUserSchema = z
  .object({
    name: nameValidation.optional(),
    lastName: nameValidation.optional(),
    email: emailValidation.optional(),
    oldPassword: passwordValidation.optional(),
    newPassword: passwordValidation.optional(),
    repeatPassword: passwordValidation.optional(),
    gender: z.nativeEnum(Gender).optional(),
    birthday: z.string().date().optional(),
    phone_number: phoneValidation.optional(),
    profile_photo_url: z.string().url().optional(),
  })
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 1 && data.profile_photo_url) {
      return;
    }

    if (Object.keys(data).length === 0 && !data.profile_photo_url) {
      ctx.addIssue({
        code: 'custom',
        message: 'At least one field must be provided for update',
        path: [
          'name',
          'lastName',
          'email',
          'password',
          'gender',
          'birthday',
          'phoneNumber',
        ],
      });
    }

    if (!!data.oldPassword && !data.repeatPassword && !data.newPassword) {
      ctx.addIssue({
        code: 'custom',
        message:
          'Please provide old password, new password and repeat password',
        path: ['oldPassword', 'newPassword', 'repeatPassword'],
      });
    }

    if (!!data.newPassword && data.repeatPassword === undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please repeat password',
        path: ['repeatPassword'],
      });
    }
    if (data.repeatPassword && data.repeatPassword !== data.newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['password', 'repeatPassword'],
      });
    }
  });

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const addressSchema = z.object({
  country: addressPartValidation,
  name: nameValidation,
  lastName: nameValidation,
  street_address: addressPartValidation,
  street_address_2: addressPartValidation.optional(),
  city: addressPartValidation,
  state_province_region: addressPartValidation,
  zip_code: zipcodeValidation,
  phone_number: phoneValidation,
});

export type AddressSchema = z.infer<typeof addressSchema>;

export const updateAddressSchema = z
  .object({
    country: addressPartValidation.optional(),
    name: nameValidation.optional(),
    lastName: nameValidation.optional(),
    street_address: addressPartValidation.optional(),
    street_address_2: addressPartValidation.optional(),
    city: addressPartValidation.optional(),
    state_province_region: addressPartValidation.optional(),
    zip_code: zipcodeValidation.optional(),
    phone_number: phoneValidation.optional(),
  })
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'At least one field must be provided for update',
        path: [
          'country',
          'name',
          'lastName',
          'street_address',
          'street_address_2',
          'city',
          'state_province_region',
          'zip_code',
          'phone_number',
        ],
      });
    }
  });

export type UpdateAddressSchema = z.infer<typeof updateAddressSchema>;

export const addFavoriteSchema = z.object({
  productId: idValidation,
});

export type AddFavoriteSchema = z.infer<typeof addFavoriteSchema>;
