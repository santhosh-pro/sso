import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt.gaurd';
import { AuthorizeGuard } from './authorize.gurad';

export function Authorize(...access: string[]) {
  return applyDecorators(
    SetMetadata('auth_key', access),
    UseGuards(JwtAuthGuard, AuthorizeGuard),
  );
}
