import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const generateAccessToken = (id: string, expireTime: string): string => {
  const token = jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: expireTime,
  });
  return token;
};

export default generateAccessToken;
