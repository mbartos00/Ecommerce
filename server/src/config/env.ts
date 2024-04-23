import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().min(1000),
  ENV: z.enum(['production', 'testing', 'development']).default('development'),
});

export const env = envSchema.parse(process.env);
