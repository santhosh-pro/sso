import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PermissionGuard } from './permission.guard';
import { RoleGuard } from './role.guard';

@Module({
    providers: [JwtAuthGuard, RoleGuard, PermissionGuard],
    exports: [JwtAuthGuard, RoleGuard, PermissionGuard],
  })
  export class SsoModule {}