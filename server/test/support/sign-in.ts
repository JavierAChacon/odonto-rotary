import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export async function signInAs(
  application: INestApplication,
  email: string,
  password: string,
): Promise<string[]> {
  const signInResponse = await request(application.getHttpServer())
    .post('/api/auth/sign-in/email')
    .send({ email, password });

  return signInResponse.headers['set-cookie'] as unknown as string[];
}
