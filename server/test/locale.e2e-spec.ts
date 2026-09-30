import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApplication } from './support/create-test-application.js';
import { resetDatabase } from './support/reset-database.js';

describe('Authentication error language (e2e)', () => {
  let application: INestApplication;

  beforeEach(async () => {
    await resetDatabase();
    application = await createTestApplication();
  });

  afterEach(async () => {
    await application.close();
  });

  function failedSignIn() {
    return request(application.getHttpServer())
      .post('/api/auth/sign-in/email')
      .send({ email: 'nobody@odonto.test', password: 'wrong-password' });
  }

  it('answers in English with the locale cookie set to en', async () => {
    const response = await failedSignIn().set('Cookie', 'locale=en');

    expect(response.body.message).toBe('Invalid email or password');
  });

  it('answers in Spanish with the locale cookie set to es', async () => {
    const response = await failedSignIn().set('Cookie', 'locale=es');

    expect(response.body.code).toBe('INVALID_EMAIL_OR_PASSWORD');
    expect(response.body.message).not.toBe('Invalid email or password');
  });

  it('falls back to the Accept-Language header without a cookie', async () => {
    const response = await failedSignIn().set('Accept-Language', 'es');

    expect(response.body.message).not.toBe('Invalid email or password');
  });
});
