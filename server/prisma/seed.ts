import { readRequiredEnvironmentVariable } from '../src/app.helper.js';
import { seedFirstAdmin } from '../src/auth/seed-first-admin.js';
import { prisma } from '../src/prisma/prisma.service.js';

const seededAdmin = await seedFirstAdmin({
  email: readRequiredEnvironmentVariable('SEED_ADMIN_EMAIL'),
  password: readRequiredEnvironmentVariable('SEED_ADMIN_PASSWORD'),
});

console.log(`Admin ready: ${seededAdmin.email}`);
await prisma.$disconnect();
