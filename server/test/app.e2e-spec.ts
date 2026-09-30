import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApplication } from './support/create-test-application.js';

describe('AppController (e2e)', () => {
  let application: INestApplication;

  beforeEach(async () => {
    application = await createTestApplication();
  });

  it('/ (GET)', () => {
    return request(application.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/health (GET) is public', () => {
    return request(application.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('ok');
  });

  afterEach(async () => {
    await application.close();
  });
});
