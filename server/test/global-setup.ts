import { execSync } from 'node:child_process';
import pg from 'pg';

export default async function prepareTestDatabase() {
  const testDatabaseUrl = process.env.TEST_DATABASE_URL;

  if (!testDatabaseUrl) {
    throw new Error('Missing required environment variable: TEST_DATABASE_URL');
  }

  const testDatabaseName = new URL(testDatabaseUrl).pathname.slice(1);
  const administrationClient = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  });

  await administrationClient.connect();
  const existingDatabases = await administrationClient.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [testDatabaseName],
  );

  if (existingDatabases.rowCount === 0) {
    await administrationClient.query(`CREATE DATABASE "${testDatabaseName}"`);
  }

  await administrationClient.end();

  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: testDatabaseUrl },
    stdio: 'inherit',
  });
}
