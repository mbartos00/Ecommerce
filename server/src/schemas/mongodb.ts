import z from 'zod';

export const mongoURLSchema = z.string().refine(
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
