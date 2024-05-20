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
