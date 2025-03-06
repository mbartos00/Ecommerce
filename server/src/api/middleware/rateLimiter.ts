import { rateLimit } from 'express-rate-limit';

const rateLimiter = rateLimit({
  windowMs: 5 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

export default rateLimiter;
