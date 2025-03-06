import cookieParser from 'cookie-parser';
import cors from 'cors';
import {
  type Express,
  json,
  urlencoded,
  static as expressStatic,
} from 'express';
import rateLimiter from '../middleware/rateLimiter';

export function setupMiddlewares(app: Express) {
  app.use(
    cors({
      origin: 'http://localhost:4200',
      credentials: true,
    }),
  );
  app.use(json());
  app.use(cookieParser());
  app.use(urlencoded({ extended: false }));
  app.use('/uploads', expressStatic('uploads'));
  app.use(expressStatic('public'));
  app.use(rateLimiter);
}
