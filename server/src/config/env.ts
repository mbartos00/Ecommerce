import { mongoURLSchema } from '@src/schemas/mongodb';
import { z } from 'zod';

const environmentSchema = z.object({
  DOMAIN: z.string(),
  DATABASE_URL: mongoURLSchema,
  ENV: z.enum(['production', 'testing', 'development']).default('development'),
  PORT: z.coerce.number().min(1000),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  JWT_SECRET: z.string(),
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string(),
  FRONTEND_DOMAIN: z.string(),
  FRONTEND_PORT: z.coerce.number().min(1000),
});

export const env = environmentSchema.parse(process.env);
