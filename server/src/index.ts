import { bootstrapDependecies } from './config/dependencies';
import { env } from './config/env';
import { createServer } from './server';

async function main() {
  const deps = bootstrapDependecies();

  try {
    const app = createServer(deps);

    app.listen(env.PORT, () => {
      console.info(`Server running on port: ${env.PORT}`);
    });
  } catch (err: unknown) {
    console.error(err);
    process.exit(1);
  }
}

main();