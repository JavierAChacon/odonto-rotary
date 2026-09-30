import { APIError } from 'better-auth/api';
import type { AuthHookContext } from '@thallesp/nestjs-better-auth';
import { AuthHook } from './auth.hook.js';
import type { PrismaService } from '../prisma/prisma.service.js';

function buildAuthHook() {
  const prisma = {
    user: { update: vi.fn().mockResolvedValue(undefined) },
    session: { deleteMany: vi.fn().mockResolvedValue(undefined) },
  };
  const authHook = new AuthHook(prisma as unknown as PrismaService);

  return { authHook, prisma };
}

function buildAuthHookContext(hookCall: {
  body?: unknown;
  returned?: unknown;
}) {
  return {
    body: hookCall.body,
    context: { returned: hookCall.returned },
  } as unknown as AuthHookContext;
}

describe('AuthHook clearMustChangePasswordAfterPasswordChange', () => {
  it('clears the flag of the person who changed the password', async () => {
    const { authHook, prisma } = buildAuthHook();

    await authHook.clearMustChangePasswordAfterPasswordChange(
      buildAuthHookContext({
        returned: { token: null, user: { id: 'user-id' } },
      }),
    );

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-id' },
      data: { mustChangePassword: false },
    });
  });

  it('writes nothing when the password change failed', async () => {
    const { authHook, prisma } = buildAuthHook();

    await authHook.clearMustChangePasswordAfterPasswordChange(
      buildAuthHookContext({
        returned: new APIError('BAD_REQUEST', { message: 'Invalid password' }),
      }),
    );

    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});

describe('AuthHook requireNewPasswordAfterAdminPasswordReset', () => {
  it('sets the flag and deletes the sessions of the person whose password was reset', async () => {
    const { authHook, prisma } = buildAuthHook();

    await authHook.requireNewPasswordAfterAdminPasswordReset(
      buildAuthHookContext({
        body: { userId: 'target-user-id', newPassword: 'temporary-password' },
        returned: { status: true },
      }),
    );

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'target-user-id' },
      data: { mustChangePassword: true },
    });
    expect(prisma.session.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'target-user-id' },
    });
  });

  it('writes nothing when the password reset failed', async () => {
    const { authHook, prisma } = buildAuthHook();

    await authHook.requireNewPasswordAfterAdminPasswordReset(
      buildAuthHookContext({
        body: { userId: 'target-user-id' },
        returned: new APIError('FORBIDDEN', { message: 'Forbidden' }),
      }),
    );

    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.session.deleteMany).not.toHaveBeenCalled();
  });
});
