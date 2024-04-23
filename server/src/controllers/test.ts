import { type Request, type Response } from 'express';
import type { Dependecies } from '../config/dependencies';

export function test(deps: Dependecies) {
  return async (req: Request, res: Response) => {
    res.status(200).send('Hello');
  };
}
