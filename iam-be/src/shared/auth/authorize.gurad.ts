import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export interface AuthorizeGuardConfig {
  userAccessControlKey: string;
  getCurrentUser: (context: ExecutionContext) => any;
}

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('AUTH_OPTIONS') private config: AuthorizeGuardConfig,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredAccess = this.reflector.getAllAndOverride<string[]>(
      'auth_key',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredAccess) {
      return true;
    }

    const user = this.config.getCurrentUser(context);
    if (!user) {
      return false;
    }
    let userAccess = user[this.config.userAccessControlKey];
    if (typeof userAccess === 'string') {
      userAccess = [userAccess];
    }

    const hasExactMatch = requiredAccess.some((requiredAccess) =>
      userAccess?.some((userAccess: string) => userAccess === requiredAccess),
    );

    return hasExactMatch;
  }
}
