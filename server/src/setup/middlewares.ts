import cookieParser from 'cookie-parser';
import cors from 'cors';
import { type Express, json, urlencoded } from 'express';

export function setupMiddlewares(app: Express) {
  app.use(cors({}));
  app.use(json());
  app.use(cookieParser());
  app.use(urlencoded({ extended: false }));
}