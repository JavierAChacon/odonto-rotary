import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module.js';
import { ProtectedProbeController } from './protected-probe.controller.js';

export async function createTestApplication(): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    imports: [AppModule],
    controllers: [ProtectedProbeController],
  }).compile();

  const application = testingModule.createNestApplication({
    bodyParser: false,
  });
  await application.init();

  return application;
}
