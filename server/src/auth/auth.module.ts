import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { AuthHook } from './auth.hook.js';
import { MustChangePasswordGuard } from './auth.guard.js';
import { auth } from './auth.service.js';

@Module({
  imports: [BetterAuthModule.forRoot({ auth })],
  providers: [
    AuthHook,
    { provide: APP_GUARD, useClass: MustChangePasswordGuard },
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
