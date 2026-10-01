import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { prisma } from '../src/prisma/prisma.service.js';
import {
  adminCredentials,
  createAdmin,
} from './support/create-signed-in-admin.js';
import { createTestApplication } from './support/create-test-application.js';
import { resetDatabase } from './support/reset-database.js';
import { runAdminSeed } from './support/run-admin-seed.js';

describe('Authentication (e2e)', () => {
  let application: INestApplication;

  beforeEach(async () => {
    await resetDatabase();
    application = await createTestApplication();
  });

  afterEach(async () => {
    await application.close();
  });

  it('creates the first admin flagged to change the password', async () => {
    runAdminSeed();

    const storedAdmin = await prisma.user.findUniqueOrThrow({
      where: { email: adminCredentials.email },
    });

    expect(storedAdmin.role).toBe('admin');
    expect(storedAdmin.mustChangePassword).toBe(true);
  }, 60000);

  it('does not create a second admin when seeding twice', async () => {
    runAdminSeed();
    runAdminSeed();

    expect(await prisma.user.count()).toBe(1);
  }, 60000);

  it('signs in with the correct password', async () => {
    await createAdmin();

    const signInResponse = await request(application.getHttpServer())
      .post('/api/auth/sign-in/email')
      .send(adminCredentials);

    expect(signInResponse.status).toBe(200);
    expect(signInResponse.body.user.mustChangePassword).toBe(true);
    expect(signInResponse.headers['set-cookie']).toBeDefined();
  });

  it('rejects a wrong password with 401', async () => {
    await createAdmin();

    const signInResponse = await request(application.getHttpServer())
      .post('/api/auth/sign-in/email')
      .send({ email: adminCredentials.email, password: 'wrong-password' });

    expect(signInResponse.status).toBe(401);
  });

  it('rejects public sign up and creates no user', async () => {
    const signUpResponse = await request(application.getHttpServer())
      .post('/api/auth/sign-up/email')
      .send({
        email: 'stranger@odonto.test',
        password: 'stranger-password',
        name: 'Stranger',
      });

    expect(signUpResponse.status).toBeGreaterThanOrEqual(400);
    expect(await prisma.user.count()).toBe(0);
  });

  it('answers the CORS preflight for the client origin with credentials', async () => {
    const preflightResponse = await request(application.getHttpServer())
      .options('/api/auth/sign-in/email')
      .set('Origin', process.env.CLIENT_ORIGIN as string)
      .set('Access-Control-Request-Method', 'POST');

    expect(preflightResponse.headers['access-control-allow-origin']).toBe(
      process.env.CLIENT_ORIGIN,
    );
    expect(preflightResponse.headers['access-control-allow-credentials']).toBe(
      'true',
    );
  });
});
