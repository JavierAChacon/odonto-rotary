import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { prisma } from '../src/prisma/prisma.service.js';
import {
  adminCredentials,
  createAdmin,
} from './support/create-signed-in-admin.js';
import { createTestApplication } from './support/create-test-application.js';
import { resetDatabase } from './support/reset-database.js';
import { signInAs } from './support/sign-in.js';

describe('Account password change through native Better Auth routes (e2e)', () => {
  let application: INestApplication;
  let adminCookies: string[];

  beforeEach(async () => {
    await resetDatabase();
    application = await createTestApplication();
    await createAdmin();
    adminCookies = await signInAs(
      application,
      adminCredentials.email,
      adminCredentials.password,
    );
  });

  afterEach(async () => {
    await application.close();
  });

  function requestProtectedNestRoute() {
    return request(application.getHttpServer())
      .get('/protected-probe')
      .set('Cookie', adminCookies);
  }

  function changePassword(currentPassword: string, newPassword: string) {
    return request(application.getHttpServer())
      .post('/api/auth/change-password')
      .set('Cookie', adminCookies)
      .send({ currentPassword, newPassword });
  }

  async function readStoredAdmin() {
    return prisma.user.findUniqueOrThrow({
      where: { email: adminCredentials.email },
    });
  }

  it('blocks Nest routes while the flag is set', async () => {
    const blockedResponse = await requestProtectedNestRoute();

    expect(blockedResponse.status).toBe(403);
    expect(blockedResponse.body.code).toBe('MUST_CHANGE_PASSWORD');
  });

  it('clears the flag after a valid change and unblocks the person', async () => {
    const changeResponse = await changePassword(
      adminCredentials.password,
      'a-brand-new-password',
    );

    expect(changeResponse.status).toBe(200);
    expect((await readStoredAdmin()).mustChangePassword).toBe(false);

    const allowedResponse = await requestProtectedNestRoute();
    expect(allowedResponse.status).toBe(200);
    expect(allowedResponse.body.email).toBe(adminCredentials.email);
  });

  it('keeps the flag when the current password is wrong', async () => {
    const changeResponse = await changePassword(
      'not-the-current-password',
      'a-brand-new-password',
    );

    expect(changeResponse.status).toBe(400);
    expect((await readStoredAdmin()).mustChangePassword).toBe(true);
  });

  it('keeps the flag when the new password is shorter than 8 characters', async () => {
    const changeResponse = await changePassword(
      adminCredentials.password,
      'short',
    );

    expect(changeResponse.status).toBe(400);
    expect((await readStoredAdmin()).mustChangePassword).toBe(true);
  });

  it('rejects a change without a session with 401', async () => {
    const response = await request(application.getHttpServer())
      .post('/api/auth/change-password')
      .send({ currentPassword: 'anything', newPassword: 'another-password' });

    expect(response.status).toBe(401);
  });

  it('rejects a protected Nest route without a session with 401', async () => {
    const response = await request(application.getHttpServer()).get(
      '/protected-probe',
    );

    expect(response.status).toBe(401);
  });
});
