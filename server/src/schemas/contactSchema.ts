import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email('Invalid email format'),
  subject: z.string().min(1),
  message: z.string().min(1),
});
