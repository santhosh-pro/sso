import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  HttpException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Authorize } from '@auth/authorize.decorator';
import { GetUserResponse, GetUserResponseData } from './get-user-response';
import { BaseController } from '@core/base.controller';
import { Role } from '@prisma/client';

@ApiTags('User')
@ApiBearerAuth()
@Controller('/users')
export class GetUserController extends BaseController {
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'getUser' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user by ID',
    type: GetUserResponse,
  })
   @Authorize(Role.MODRATOR)
  async execute(@Param('id') id: string): Promise<GetUserResponse> {
    return await this.prismaService.client(async ({ dbContext }) => {
      const user = await dbContext.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const data: GetUserResponseData = {
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
