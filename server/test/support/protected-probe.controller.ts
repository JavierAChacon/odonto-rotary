import { Controller, Get } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('protected-probe')
export class ProtectedProbeController {
  @Get()
  readProtectedProbe(@Session() session: UserSession) {
    return { email: session.user.email };
  }
}
