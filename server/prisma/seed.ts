import { readRequiredEnvironmentVariable } from '../src/app.helper.js';
import { auth } from '../src/auth/auth.service.js';
import { prisma } from '../src/prisma/prisma.service.js';

const adminEmail = readRequiredEnvironmentVariable('SEED_ADMIN_EMAIL');
const adminPassword = readRequiredEnvironmentVariable('SEED_ADMIN_PASSWORD');

const existingAdmin = await prisma.user.findUnique({
  where: { email: adminEmail.toLowerCase() },
});

if (!existingAdmin) {
  await auth.api.createUser({
    body: {
      email: adminEmail,
      password: adminPassword,
      name: 'Administrator',
      role: 'admin',
    },
  });
}

console.log(`Admin ready: ${adminEmail}`);
await prisma.$disconnect();
