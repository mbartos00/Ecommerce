import type { Request, Response, NextFunction } from 'express';
import fs from 'node:fs';

const cleanupFileOnError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    next();
    return;
  }

  if (req.file) {
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting file:', unlinkErr);
      }
    });
  }
  next(err);
};

export default cleanupFileOnError;
