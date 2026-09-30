import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { MustChangePasswordGuard } from './auth.guard.js';

function buildExecutionContext(): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ headers: {} }) }),
  } as unknown as ExecutionContext;
}

function buildGuard(sessionResult: unknown) {
  const authService = {
    api: { getSession: vi.fn().mockResolvedValue(sessionResult) },
  };

  return new MustChangePasswordGuard(authService as never);
}

describe('MustChangePasswordGuard', () => {
  it('allows a request without a session so the auth guard decides', async () => {
    const guard = buildGuard(null);

    await expect(guard.canActivate(buildExecutionContext())).resolves.toBe(
      true,
    );
  });

  it('allows a person who already changed the password', async () => {
    const guard = buildGuard({ user: { mustChangePassword: false } });

    await expect(guard.canActivate(buildExecutionContext())).resolves.toBe(
      true,
    );
  });

  it('blocks a person who must change the password with a stable code', async () => {
    const guard = buildGuard({ user: { mustChangePassword: true } });

    await expect(guard.canActivate(buildExecutionContext())).rejects.toThrow(
      ForbiddenException,
    );

    await expect(
      guard.canActivate(buildExecutionContext()),
    ).rejects.toMatchObject({ response: { code: 'MUST_CHANGE_PASSWORD' } });
  });
});
