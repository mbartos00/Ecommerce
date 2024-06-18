import type { PaymentTypes } from '@prisma/client';

export const SIGNALS = ['SIGINT', 'SIGTERM', 'SIGQUIT'] as const;
export const SALE_PERCENTAGE = 50;
export const DEFAULT_PAGE = '1';
export const DEFAULT_PER_PAGE = '20';
export const DEFAULT_UPLOAD_PATH = '/uploads/';

export const PAYMENT_TYPES: Record<PaymentTypes, PaymentTypes> = {
  credit_card: 'credit_card',
  paypal: 'paypal',
  bank_transfer: 'bank_transfer',
} as const;
