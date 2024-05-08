import type { Dependecies } from '../../config/dependencies';
import { SIGNALS } from '../../constants';

export function setupShutdown({ prisma }: Dependecies) {
  for (const signal of SIGNALS) {
    process.on(signal, () => {
      console.log('Closing server');

      prisma.$disconnect();
      process.exit(0);
    });
  }
}
