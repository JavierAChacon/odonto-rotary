import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';
import { AUTH_CODE } from './auth.constant.js';
import type { auth } from './auth.service.js';

@Injectable()
export class MustChangePasswordGuard implements CanActivate {
  constructor(private readonly authService: AuthService<typeof auth>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const session = await this.authService.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (session?.user.mustChangePassword) {
      throw new ForbiddenException({ code: AUTH_CODE.mustChangePassword });
    }

    return true;
  }
}
