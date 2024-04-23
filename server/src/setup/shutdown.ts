import type { Dependecies } from '../config/dependencies';
import { SIGNALS } from '../constants';

export function setupShutdown(_: Dependecies) {
  for (const signal of SIGNALS) {
    process.on(signal, () => {
      console.log('Closing server');
      process.exit(0);
    });
  }
}
