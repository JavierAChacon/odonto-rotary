import { execFileSync } from 'node:child_process';
import { adminCredentials } from './create-signed-in-admin.js';

export function runAdminSeed() {
  execFileSync('npx', ['prisma', 'db', 'seed'], {
    env: {
      ...process.env,
      SEED_ADMIN_EMAIL: adminCredentials.email,
      SEED_ADMIN_PASSWORD: adminCredentials.password,
    },
    stdio: 'pipe',
  });
}
