import { prisma } from '../prisma/prisma.service.js';
import { auth } from './auth.service.js';

interface FirstAdminCredentials {
  email: string;
  password: string;
}

export async function seedFirstAdmin(adminCredentials: FirstAdminCredentials) {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminCredentials.email.toLowerCase() },
  });

  if (existingAdmin) {
    return existingAdmin;
  }

  const createdAdmin = await auth.api.createUser({
    body: {
      email: adminCredentials.email,
      password: adminCredentials.password,
      name: 'Administrator',
      role: 'admin',
    },
  });

  return createdAdmin.user;
}
