import { INestApplication } from '@nestjs/common';
import { auth } from '../../src/auth/auth.service.js';
import { prisma } from '../../src/prisma/prisma.service.js';
import { signInAs } from './sign-in.js';

export const adminCredentials = {
  email: 'admin@odonto.test',
  password: 'initial-admin-password',
};

export async function createAdmin() {
  await auth.api.createUser({
    body: {
      email: adminCredentials.email,
      password: adminCredentials.password,
      name: 'Administrator',
      role: 'admin',
    },
  });
}

export async function createSignedInAdmin(
  application: INestApplication,
): Promise<string[]> {
  await createAdmin();
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
