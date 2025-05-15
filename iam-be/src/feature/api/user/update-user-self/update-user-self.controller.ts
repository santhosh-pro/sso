import { Controller, Put, HttpCode, HttpStatus, Body, Param, HttpException } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Authorize } from '@auth/authorize.decorator';
import { UpdateUserSelfRequest } from './update-user-self-request';
import { UpdateUserSelfResponse } from './update-user-self-response';
import { BaseController } from '@core/base.controller';
import { Role } from '@prisma/client';
import { CurrentUser } from '@auth/current-user';

@ApiTags('User')
@ApiBearerAuth()
@Controller('/users/me')
export class UpdateUserSelfController extends BaseController {

  @Put()
  @ApiResponse({ status: HttpStatus.OK, description: '', type: UpdateUserSelfResponse, })
  @ApiOperation({ operationId: 'updateUserSelf' })
  @Authorize(Role.MODRATOR, Role.MEMBER)
  @HttpCode(200)
  async execute(@CurrentUser() currentUser:any, @Body() body: UpdateUserSelfRequest,): Promise<UpdateUserSelfResponse> {
   return await this.prismaService.client(async ({ dbContext }) => {
      const user = await dbContext.user.findUnique({ where: { id: currentUser.sub } });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await dbContext.user.update({
        where: { id: currentUser.sub },
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phoneNumber: body.phoneNumber,
        },
      });

      return {
        successMessage: 'User has been updated successfully',
      };
    });
  }
}
