import { checkAndRevokeExpiredDiscounts } from '@src/utils/check-and-revoke-expired-discounts';
import cron from 'node-cron';

export function setupCronJobs() {
  cron.schedule('0 0 * * *', checkAndRevokeExpiredDiscounts);
}
