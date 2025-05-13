import { Controller, Put, HttpCode, HttpStatus, Body,Param,HttpException } from '@nestjs/common';
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

@ApiTags('User')
@ApiBearerAuth()
@Controller('/users/me')
export class UpdateUserSelfController extends BaseController {

  @Put(':id')
  @ApiResponse({ status: HttpStatus.OK,description: '',type: UpdateUserSelfResponse, })
  @ApiOperation({ operationId: 'updateUserSelf' })
@Authorize(/*Roles*/)
  @HttpCode(200)
  async execute(@Param('id') id: string, @Body() body: UpdateUserSelfRequest,): Promise<UpdateUserSelfResponse> {
    throw new HttpException('Method not implemented.', HttpStatus.NOT_IMPLEMENTED);
  }
}
