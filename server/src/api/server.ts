import express from 'express';
import type { Dependecies } from '../config/dependencies';
import { setupHandlers } from './setup/handlers';
import { setupMiddlewares } from './setup/middlewares';
import { setupRoutes } from './setup/routes';
import { setupShutdown } from './setup/shutdown';
import { setupCronJobs } from './setup/cron';

export function createServer(deps: Dependecies) {
  const app = express();

  setupShutdown(deps);

  setupMiddlewares(app);
  setupRoutes(app, deps);
  setupHandlers(app);
  setupCronJobs();

  return app;
}
