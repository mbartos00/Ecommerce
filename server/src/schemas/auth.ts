import { z } from 'zod';

const emailValidation = z.string().min(6).email();
const passwordValidation = z.string().min(6).max(30);
const nameValidation = z.string().min(3).max(30);

export const registerSchema = z.object({
  name: nameValidation,
  lastName: nameValidation,
  email: emailValidation,
  password: passwordValidation,
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export type LoginSchema = z.infer<typeof loginSchema>;

enum Gender {
  male = 'male',
  female = 'female',
  ohter = 'other',
}

const profileSchema = z.object({
  gender: z.nativeEnum(Gender).optional(),
  birthday: z.string().date().optional(),
  phone_number: z
    .string()
    .refine((value) =>
      /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(value),
    )
    .optional(),
  profile_photo_url: z.string().url().optional(),
});

export const updateUserSchema = z
  .object({
    name: nameValidation.optional(),
    lastName: nameValidation.optional(),
    email: emailValidation.optional(),
    oldPassword: passwordValidation.optional(),
    newPassword: passwordValidation.optional(),
    repeatPassword: passwordValidation.optional(),
    profile: profileSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'At least one field must be provided for update',
        path: ['name', 'lastName', 'email', 'password', 'profile'],
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
    if (data.profile && Object.keys(data.profile).length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['gender', 'birthday', 'profilePhotoUrl', 'phoneNumber'],
        message: 'At least one field must be provided for update',
      });
    }
  });

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
