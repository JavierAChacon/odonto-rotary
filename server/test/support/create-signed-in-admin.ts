import { INestApplication } from '@nestjs/common';
import { seedFirstAdmin } from '../../src/auth/seed-first-admin.js';
import { prisma } from '../../src/prisma/prisma.service.js';
import { signInAs } from './sign-in.js';

export const adminCredentials = {
  email: 'admin@odonto.test',
  password: 'initial-admin-password',
};

export async function createSignedInAdmin(
  application: INestApplication,
): Promise<string[]> {
  await seedFirstAdmin(adminCredentials);
  await prisma.user.update({
    where: { email: adminCredentials.email },
    data: { mustChangePassword: false },
  });

  return signInAs(
    application,
    adminCredentials.email,
    adminCredentials.password,
  );
}
