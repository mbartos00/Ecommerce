import { bootstrapDependecies } from './config/dependencies';
import { env } from './config/env';
import { createServer } from './api/server';

async function main() {
  const deps = await bootstrapDependecies();

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
