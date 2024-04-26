import { z } from 'zod';

const mongoDbConnectionStringSchema = z.string().refine(
  (value) => {
    if (!value.startsWith('mongodb+srv://')) {
      return false;
    }

    const regex = /^mongodb\+srv:\/\/(.+):(.+)@(.+)\/(.+)$/;
    const match = value.match(regex);

    if (!match) {
      return false;
    }

    const [_, username, password, host, databaseName] = match;

    return username && password && host && databaseName;
  },
  {
    message: 'Invalid MongoDB Atlas connection string',
  },
);

const environmentSchema = z.object({
  PORT: z.coerce.number().min(1000),
  ENV: z.enum(['production', 'testing', 'development']).default('development'),
  DATABASE_URL: mongoDbConnectionStringSchema,
});

export const env = environmentSchema.parse(process.env);
