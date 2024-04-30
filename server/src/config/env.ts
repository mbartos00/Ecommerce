import { mongoURLSchema } from '@src/schemas/mongodb';
import { z } from 'zod';

const environmentSchema = z.object({
  DATABASE_URL: mongoURLSchema,
  ENV: z.enum(['production', 'testing', 'development']).default('development'),
  PORT: z.coerce.number().min(1000),
  JWT_SECRET: z.string(),
});

export const env = environmentSchema.parse(process.env);
