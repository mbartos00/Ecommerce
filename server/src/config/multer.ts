import { DEFAULT_UPLOAD_PATH } from '@src/constants';
import type { Request } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      req.user?.id ?? Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(
    new Error(
      'File upload only supports the following filetypes - ' + filetypes,
    ),
  );
};

const upload = (dest = DEFAULT_UPLOAD_PATH) =>
  multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB limit
    fileFilter: fileFilter,
    dest,
  });

export default upload;
