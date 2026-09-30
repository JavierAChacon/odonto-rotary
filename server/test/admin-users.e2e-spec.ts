import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { prisma } from '../src/prisma/prisma.service.js';
import { createSignedInAdmin } from './support/create-signed-in-admin.js';
import { createTestApplication } from './support/create-test-application.js';
import { resetDatabase } from './support/reset-database.js';
import { signInAs } from './support/sign-in.js';

const temporaryPassword = 'Kq7mZp3WnR8vTx2B';

describe('Admin users through native Better Auth routes (e2e)', () => {
  let application: INestApplication;
  let adminCookies: string[];

  beforeEach(async () => {
    await resetDatabase();
    application = await createTestApplication();
    adminCookies = await createSignedInAdmin(application);
  });

  afterEach(async () => {
    await application.close();
  });

  function createUserWithCookies(userFields: object, cookies?: string[]) {
    const createUserRequest = request(application.getHttpServer()).post(
      '/api/auth/admin/create-user',
    );
    if (cookies) {
      createUserRequest.set('Cookie', cookies);
    }
    return createUserRequest.send(userFields);
  }

  function createUserAsAdmin(userFields: object) {
    return createUserWithCookies(userFields, adminCookies);
  }

  function setUserPasswordAsAdmin(userId: string, newPassword: string) {
    return request(application.getHttpServer())
      .post('/api/auth/admin/set-user-password')
      .set('Cookie', adminCookies)
      .send({ userId, newPassword });
  }

  it('rejects creating a user without a session with 401', async () => {
    const response = await createUserWithCookies({
      name: 'Dr Ana',
      email: 'ana@odonto.test',
      password: temporaryPassword,
      role: 'dentist',
    });

    expect(response.status).toBe(401);
  });

  it('creates a dentist with a temporary password flagged for change', async () => {
    const response = await createUserAsAdmin({
      name: 'Dr Ana',
      email: 'ana@odonto.test',
      password: temporaryPassword,
      role: 'dentist',
    });

    expect(response.status).toBe(200);

    const storedDentist = await prisma.user.findUniqueOrThrow({
      where: { email: 'ana@odonto.test' },
    });
    expect(storedDentist.role).toBe('dentist');
    expect(storedDentist.mustChangePassword).toBe(true);

    const dentistCookies = await signInAs(
      application,
      'ana@odonto.test',
      temporaryPassword,
    );
    expect(dentistCookies).toBeDefined();
  });

  it('rejects an unknown role with 400', async () => {
    const response = await createUserAsAdmin({
      name: 'Hacker',
      email: 'hacker@odonto.test',
      password: temporaryPassword,
      role: 'superuser',
    });

    expect(response.status).toBe(400);
    expect(
      await prisma.user.count({ where: { email: 'hacker@odonto.test' } }),
    ).toBe(0);
  });

  it('rejects a missing body with 400', async () => {
    const response = await createUserAsAdmin({});

    expect(response.status).toBe(400);
  });

  it('rejects a second account that differs only by email case', async () => {
    await createUserAsAdmin({
      name: 'Staff One',
      email: 'Reception@Odonto.test',
      password: temporaryPassword,
      role: 'staff',
    });

    const duplicateResponse = await createUserAsAdmin({
      name: 'Staff Two',
      email: 'reception@odonto.test',
      password: temporaryPassword,
      role: 'staff',
    });

    expect(duplicateResponse.status).toBeGreaterThanOrEqual(400);
    expect(await prisma.user.count({ where: { role: 'staff' } })).toBe(1);
  });

  it.each(['staff', 'dentist'] as const)(
    'forbids a %s from creating users with 403',
    async (role) => {
      await createUserAsAdmin({
        name: 'Clinic Member',
        email: `${role}@odonto.test`,
        password: temporaryPassword,
        role,
      });
      const memberCookies = await signInAs(
        application,
        `${role}@odonto.test`,
        temporaryPassword,
      );

      const forbiddenResponse = await createUserWithCookies(
        {
          name: 'Other',
          email: 'other@odonto.test',
          password: temporaryPassword,
          role: 'staff',
        },
        memberCookies,
      );

      expect(forbiddenResponse.status).toBe(403);
      expect(
        await prisma.user.count({ where: { email: 'other@odonto.test' } }),
      ).toBe(0);
    },
  );

  it('resets a password, flags the change and revokes the old sessions', async () => {
    await createUserAsAdmin({
      name: 'Staff Member',
      email: 'staff@odonto.test',
      password: temporaryPassword,
      role: 'staff',
    });
    const staffOldCookies = await signInAs(
      application,
      'staff@odonto.test',
      temporaryPassword,
    );
    const staffUser = await prisma.user.findUniqueOrThrow({
      where: { email: 'staff@odonto.test' },
    });
    await prisma.user.update({
      where: { id: staffUser.id },
      data: { mustChangePassword: false },
    });

    const resetResponse = await setUserPasswordAsAdmin(
      staffUser.id,
      'another-temporary-password',
    );

    expect(resetResponse.status).toBe(200);

    const flaggedStaff = await prisma.user.findUniqueOrThrow({
      where: { id: staffUser.id },
    });
    expect(flaggedStaff.mustChangePassword).toBe(true);

    const oldSessionResponse = await request(application.getHttpServer())
      .get('/api/auth/get-session')
      .set('Cookie', staffOldCookies);
    expect(oldSessionResponse.body).toBeNull();

    const newCookies = await signInAs(
      application,
      'staff@odonto.test',
      'another-temporary-password',
    );
    expect(newCookies).toBeDefined();
  });
});
