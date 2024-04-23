import { json, urlencoded, type Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export function setupMiddlewares(app: Express) {
  app.use(cors({}));
  app.use(json());
  app.use(cookieParser());
  app.use(urlencoded({ extended: false }));
}
