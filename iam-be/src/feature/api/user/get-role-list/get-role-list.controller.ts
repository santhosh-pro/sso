import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Authorize } from '@auth/authorize.decorator';
import { GetRoleListResponse } from './get-role-list-response';
import { BaseController } from '@core/base.controller';
import { roles } from '@core/enum-mapping';
import { SuccessMessages } from '@core/models/message';
import { Role } from '@prisma/client';

@ApiTags('User')
@ApiBearerAuth()
@Controller('roles')
export class GetRoleListController extends BaseController {

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: '', type: GetRoleListResponse, })
  @ApiOperation({ operationId: 'getRoleList' })
  @Authorize(Role.MODRATOR, Role.SUPER_ADMIN, Role.DEV)
  @HttpCode(200)
  async execute(): Promise<GetRoleListResponse> {
    const roleList = roles;

    return {
      successMessage: SuccessMessages.getListSuccess('Role'),
      data: roleList.map((role) => ({
        id: role.id,
        name: role.name,
      })),
    };

  }
}
