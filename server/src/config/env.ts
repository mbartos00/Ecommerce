import { z } from 'zod';

const environmentSchema = z.object({
  PORT: z.coerce.number().min(1000),
  ENV: z.enum(['production', 'testing', 'development']).default('development'),
});

export const env = environmentSchema.parse(process.env);
