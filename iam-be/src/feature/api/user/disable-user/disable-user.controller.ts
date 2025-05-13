import { Controller, Put, HttpCode, HttpStatus, Param, HttpException } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DisableUserResponse } from './disable-user-response';
import { BaseController } from '@core/base.controller';

@ApiTags('User')
// @ApiBearerAuth()
@Controller('/users/:id/disable')
export class DisableUserController extends BaseController {
  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'disableUser' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully disabled/enabled',
    type: DisableUserResponse,
  })
  // @Authorize(/* Roles if needed */)
  async execute(
    @Param('id') id: string,
  ): Promise<DisableUserResponse> {
    return await this.prismaService.client(async ({ dbContext }) => {
      const user = await dbContext.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await dbContext.user.update({
        where: { id },
        data: { isActive: false },
      });

      const response: DisableUserResponse = {
        successMessage: 'User has been disabled successfully',
      };

      return response;
    });
  }
}
