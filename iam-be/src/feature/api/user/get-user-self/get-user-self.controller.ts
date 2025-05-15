import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Authorize } from '@auth/authorize.decorator';
import { GetUserSelfResponse, GetUserSelfResponseData } from './get-user-self-response';
import { BaseController } from '@core/base.controller';
import { Role } from '@prisma/client';
import { CurrentUser } from '@auth/current-user';

@ApiTags('User')
@ApiBearerAuth()
@Controller('/users/me')
export class GetUserSelfController extends BaseController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'getUserSelf' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user by ID',
    type: GetUserSelfResponse,
  })
   @Authorize(Role.MODRATOR, Role.MEMBER)
  async execute(@CurrentUser() currentUser:any): Promise<GetUserSelfResponse> {
    return await this.prismaService.client(async ({ dbContext }) => {
      const user = await dbContext.user.findUnique({
        where: { id: currentUser.sub },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const data: GetUserSelfResponseData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || null,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
      };

      return {
        successMessage: 'User has been retrieved successfully',
        data,
      };
    });
  }
}
