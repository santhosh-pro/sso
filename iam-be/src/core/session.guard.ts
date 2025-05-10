import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Request } from 'express';
  
  @Injectable()
  export class SessionGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<Request>();
  
      if (request.session && request.session.userId) {
        return true;
      }
  
      throw new UnauthorizedException('User not logged in');
    }
  }
