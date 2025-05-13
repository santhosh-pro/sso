import {
  Controller,
  Put,
  HttpCode,
  HttpStatus,
  Param,
  HttpException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Authorize } from '@auth/authorize.decorator';
import { EnableUserResponse } from './enable-user-response';
import { BaseController } from '@core/base.controller';

@ApiTags('User')
// @ApiBearerAuth()
@Controller('/users/:id/enable')
export class EnableUserController extends BaseController {
  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'enableUser' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully enabled',
    type: EnableUserResponse,
  })
  // @Authorize(/* Roles if needed */)
  async execute(
    @Param('id') id: string,
  ): Promise<EnableUserResponse> {
    return await this.prismaService.client(async ({ dbContext }) => {
      const user = await dbContext.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await dbContext.user.update({
        where: { id },
        data: { isActive: true },
      });

      const response: EnableUserResponse = {
        successMessage: 'User has been enabled successfully',
      };

      return response;
    });
  }
}
