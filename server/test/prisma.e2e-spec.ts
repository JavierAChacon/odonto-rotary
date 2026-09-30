import { prisma } from '../src/prisma/prisma.service.js';

describe('Prisma database connection (e2e)', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('runs a query against the test database', async () => {
    const queryResult = await prisma.$queryRaw<
      { connected: number }[]
    >`SELECT 1 AS connected`;

    expect(queryResult[0].connected).toBe(1);
  });

  it('uses the test database and not the development one', async () => {
    const databaseRows = await prisma.$queryRaw<
      { current_database: string }[]
    >`SELECT current_database()`;

    expect(databaseRows[0].current_database).toBe('odonto_test');
  });
});
