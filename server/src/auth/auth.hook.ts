import { Injectable } from '@nestjs/common';
import { AfterHook, Hook } from '@thallesp/nestjs-better-auth';
import type { AuthHookContext } from '@thallesp/nestjs-better-auth';
import { isAPIError } from 'better-auth/api';
import { PrismaService } from '../prisma/prisma.service.js';

@Hook()
@Injectable()
export class AuthHook {
  constructor(private readonly prisma: PrismaService) {}

  @AfterHook('/change-password')
  async clearMustChangePasswordAfterPasswordChange(
    authHookContext: AuthHookContext,
  ) {
    const { returned } = authHookContext.context;

    if (!returned || isAPIError(returned)) {
      return;
    }

    const { user: userWhoChangedPassword } = returned as {
      user: { id: string };
    };
    await this.prisma.user.update({
      where: { id: userWhoChangedPassword.id },
      data: { mustChangePassword: false },
    });
  }

  @AfterHook('/admin/set-user-password')
  async requireNewPasswordAfterAdminPasswordReset(
    authHookContext: AuthHookContext,
  ) {
    const { returned } = authHookContext.context;

    if (!returned || isAPIError(returned)) {
      return;
    }

    const { userId } = authHookContext.body;
    await this.prisma.user.update({
      where: { id: userId },
      data: { mustChangePassword: true },
    });
    await this.prisma.session.deleteMany({ where: { userId } });
  }
}
