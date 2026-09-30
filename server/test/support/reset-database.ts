import { prisma } from '../../src/prisma/prisma.service.js';

export async function resetDatabase() {
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
}
