import * as dotenv from 'dotenv';
import path from 'path';
/**
 * getting environment variables
 */
export function getEnv() {
  const environment = process.env.ENV;
  if (!environment) {
    console.error('NO ENV PASSED!');
    process.exit(1);
  }

  const envPath = path.resolve(
    process.cwd(),
    'src/helper/env',
    `.env.${environment}`,
  );
  const result = dotenv.config({ path: envPath, override: true });

  if (result.error) {
    console.error(`Failed to load ${envPath}`, result.error);
    process.exit(1);
  }

  console.log(`Loaded environment: .env.${environment}`);
}
