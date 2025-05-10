import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './sso/jwt-auth.guard';
import { RoleGuard } from './sso/role.guard';
import { Roles } from './sso/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
@Roles('default-roles-mastder')
  getHello(): string {
    return this.appService.getHello();
  }
}
