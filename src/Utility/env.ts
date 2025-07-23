import * as path from 'path';
import * as dotenv from 'dotenv';

export const getEnv = () => {
  if (process.env.ENV) {
    const envPath = path.resolve(__dirname, `../../helper/env/.env.${process.env.ENV}`);
    dotenv.config({
      override: true,
      path: envPath,
    });
    console.log(`Loaded ${envPath}`);
  }
};
